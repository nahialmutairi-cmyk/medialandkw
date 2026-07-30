import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const siteUrl = 'https://medialandkw.netlify.app';
const errors = [];
const warnings = [];

const prohibitedClaims = [
  'الأولى في الكويت',
  'أفضل شركة',
  'الشركة الرائدة',
  'نتائج مضمونة',
  'نضمن مضاعفة',
  'نضمن زيادة الأرباح',
  'نجاح مضمون',
  'مضاعفة مبيعاتك',
  'زيادة مبيعات بنسبة 120%',
  '8000 متابع',
  '150 ألف مشاهدة',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function routeFromFile(file) {
  const rel = path.relative(dist, file).replaceAll(path.sep, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '')}`;
}

function matchAll(regex, text) {
  return [...text.matchAll(regex)].map((match) => match[1]);
}

function checkJsonLd(route, html) {
  const scripts = matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, html);
  if (!scripts.length) {
    errors.push(`${route}: missing JSON-LD`);
    return;
  }
  scripts.forEach((script, index) => {
    try {
      JSON.parse(script);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD script #${index + 1}: ${error.message}`);
    }
  });
}

function resolveInternalHref(route, href) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('sms:')) {
    return null;
  }
  if (href.startsWith('#')) {
    return href === '#' ? 'BROKEN_HASH' : null;
  }
  const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
  if (clean.startsWith('/')) return clean;
  const base = route === '/' ? '/' : `${route}/`;
  return path.posix.normalize(`${base}${clean}`);
}

if (!fs.existsSync(dist)) {
  errors.push('dist folder is missing; run npm run build first');
} else {
  const htmlFiles = walk(dist).filter((file) => file.endsWith('index.html'));
  const routes = new Set(htmlFiles.map(routeFromFile));
  const titles = new Map();
  const descriptions = new Map();
  const sitemapPath = path.join(dist, 'sitemap.xml');
  const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
  const sitemapUrls = new Set(matchAll(/<loc>(.*?)<\/loc>/g, sitemap).map((url) => {
    const route = url.replace(siteUrl, '') || '/';
    return route === '/' ? '/' : route.replace(/\/$/, '');
  }));

  if (!htmlFiles.length) errors.push('no prerendered HTML files found in dist');
  if (!sitemap) errors.push('dist/sitemap.xml is missing');
  if (!fs.existsSync(path.join(dist, 'robots.txt'))) errors.push('dist/robots.txt is missing');

  for (const file of htmlFiles) {
    const route = routeFromFile(file);
    const html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim();
    const h1s = matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, html);
    const canonicals = matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, html);
    const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);

    if (!title) errors.push(`${route}: missing title`);
    if (!description) errors.push(`${route}: missing meta description`);
    if (h1s.length !== 1) errors.push(`${route}: expected one H1, found ${h1s.length}`);
    if (canonicals.length !== 1) errors.push(`${route}: expected one canonical, found ${canonicals.length}`);
    const expectedCanonical = `${siteUrl}${route === '/' ? '/' : `${route}/`}`;
    if (canonicals[0] && canonicals[0] !== expectedCanonical) {
      errors.push(`${route}: canonical mismatch (${canonicals[0]})`);
    }

    if (title) {
      if (titles.has(title)) errors.push(`${route}: duplicate title also used by ${titles.get(title)}`);
      titles.set(title, route);
    }
    if (description) {
      if (descriptions.has(description)) errors.push(`${route}: duplicate description also used by ${descriptions.get(description)}`);
      descriptions.set(description, route);
    }

    if (!noindex && !sitemapUrls.has(route)) errors.push(`${route}: indexable route missing from sitemap`);
    if (noindex && sitemapUrls.has(route)) errors.push(`${route}: noindex route appears in sitemap`);

    for (const claim of prohibitedClaims) {
      if (html.includes(claim)) errors.push(`${route}: prohibited claim found: ${claim}`);
    }

    for (const imageMatch of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) {
      errors.push(`${route}: image without alt: ${imageMatch[0].slice(0, 80)}`);
    }

    for (const href of matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, html)) {
      const internal = resolveInternalHref(route, href);
      if (internal === 'BROKEN_HASH') errors.push(`${route}: broken placeholder href="#"`);
      if (internal && internal !== 'BROKEN_HASH' && !internal.startsWith('/u/') && !routes.has(internal)) {
        errors.push(`${route}: broken internal link to ${href}`);
      }
      if (href.startsWith('/') && href !== '/' && !href.endsWith('/') && !/[?#]/.test(href) && !/\.[a-z0-9]+$/i.test(href)) {
        errors.push(`${route}: internal link is missing trailing slash: ${href}`);
      }
    }

    checkJsonLd(route, html);
  }

  for (const sitemapRoute of sitemapUrls) {
    if (!routes.has(sitemapRoute)) errors.push(`sitemap contains route without prerendered HTML: ${sitemapRoute}`);
  }

  const robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
  for (const allowedRoute of ['/privacy-policy', '/terms-and-conditions', '/terms-of-service', '/cookie-policy', '/about', '/contact']) {
    if (new RegExp(`Disallow:\\s*${allowedRoute}\\b`).test(robots)) {
      errors.push(`robots.txt incorrectly disallows ${allowedRoute}`);
    }
  }
}

if (warnings.length) {
  console.warn(warnings.join('\n'));
}

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('SEO audit passed.');
