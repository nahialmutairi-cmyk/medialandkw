import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const siteUrl = 'https://medialandkw.netlify.app';
const reportPath = path.join(dist, 'trailing-slash-report.json');
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function routeFromFile(file) {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/');
  return relative === 'index.html' ? '/' : `/${relative.replace(/\/index\.html$/, '')}`;
}

function expectedUrl(route) {
  return `${siteUrl}${route === '/' ? '/' : `${route}/`}`;
}

function collectSiteUrls(value, urls) {
  if (typeof value === 'string') {
    if (value.startsWith(siteUrl)) urls.push(value);
    return;
  }
  if (Array.isArray(value)) value.forEach((item) => collectSiteUrls(item, urls));
  if (value && typeof value === 'object') Object.values(value).forEach((item) => collectSiteUrls(item, urls));
}

if (!fs.existsSync(dist)) {
  console.error('dist is missing; run npm run build first.');
  process.exit(1);
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('index.html'));
const routes = new Set(htmlFiles.map(routeFromFile));
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
let canonicalCount = 0;
let internalLinkCount = 0;
let jsonLdUrlCount = 0;

for (const file of htmlFiles) {
  const route = routeFromFile(file);
  const html = fs.readFileSync(file, 'utf8');
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];
  const expected = expectedUrl(route);

  if (canonical !== expected) errors.push(`${route}: canonical is not the final URL (${canonical ?? 'missing'})`);
  if (ogUrl !== canonical) errors.push(`${route}: og:url does not match canonical`);
  if (canonical === expected) canonicalCount += 1;

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1];
    if (!href.startsWith('/') || href === '/' || /[?#]/.test(href) || /\.[a-z0-9]+$/i.test(href)) continue;
    internalLinkCount += 1;
    if (!href.endsWith('/')) errors.push(`${route}: internal link is not final: ${href}`);

    const target = href.replace(/\/$/, '');
    if (!routes.has(target)) errors.push(`${route}: internal link target is missing: ${href}`);
  }

  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const urls = [];
      collectSiteUrls(JSON.parse(match[1]), urls);
      jsonLdUrlCount += urls.length;
      urls.forEach((url) => {
        const pathname = new URL(url).pathname;
        if (pathname !== '/' && !pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(pathname)) {
          errors.push(`${route}: JSON-LD URL is not final: ${url}`);
        }
      });
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }
}

if (sitemapUrls.length !== 94) errors.push(`sitemap URL count is ${sitemapUrls.length}, expected 94`);
sitemapUrls.forEach((url) => {
  const pathname = new URL(url).pathname;
  if (!url.endsWith('/')) errors.push(`sitemap URL is not final: ${url}`);
  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  if (!routes.has(route)) errors.push(`sitemap URL has no prerendered page: ${url}`);
});

const report = {
  htmlPages: htmlFiles.length,
  sitemapUrls: sitemapUrls.length,
  sitemapUrlsWithFinalTrailingSlash: sitemapUrls.filter((url) => url.endsWith('/')).length,
  alignedCanonicals: canonicalCount,
  normalizedInternalLinks: internalLinkCount,
  normalizedJsonLdUrls: jsonLdUrlCount,
  exceptions: errors,
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Trailing slash audit failed with ${errors.length} issue(s):`);
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Trailing slash audit passed: ${JSON.stringify(report)}`);
