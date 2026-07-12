import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { siteConfig } from './src/siteConfig';
import { getSeoForPathname, generateJsonLd } from './src/seoData';
import { AppContent } from './src/App';
import { getServiceIndustryPath, serviceIndustryPages } from './src/serviceIndustryData';
import { areaData, getAreaPath } from './src/areaData';

// Mock browser environment for Server-Side Rendering
const globalAny: any = global;
globalAny.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { pathname: '', search: '', hash: '', href: '' },
};
globalAny.document = {
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {} }),
  head: { appendChild: () => {} },
  getElementById: () => null,
  body: { appendChild: () => {} },
};

try {
  Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'node' },
    writable: true,
    configurable: true,
  });
} catch (e) {
  // Ignore fallback
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalAny.IntersectionObserver = IntersectionObserverMock;

// Constants
const DIST_DIR = path.join(process.cwd(), 'dist');
const BASE_TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(BASE_TEMPLATE_PATH)) {
  console.error(`Error: Base template not found at ${BASE_TEMPLATE_PATH}. Please run "npm run build" first.`);
  process.exit(1);
}

const baseTemplate = fs.readFileSync(BASE_TEMPLATE_PATH, 'utf-8');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripSeoHeadTags(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/\s*<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>\s*/gi, '')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/\s*<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

// Gather all routes dynamically
const staticRoutes = [
  '/',
  '/about',
  '/portfolio',
  '/case-studies',
  '/contact',
  '/request-quote',
  '/services',
  '/industries',
  '/locations',
  '/blog',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy'
];

const serviceRoutes = siteConfig.services.map(s => `/services/${s.id}`);
const serviceIndustryRoutes = serviceIndustryPages.map(getServiceIndustryPath);
const industryRoutes = siteConfig.industries.map(i => `/industries/${i.id}`);
const locationRoutes = siteConfig.locations.map(l => `/locations/${l.id}`);
const areaRoutes = areaData.map(getAreaPath);
const blogRoutes = siteConfig.blog.map(b => `/blog/${b.id}`);

const allRoutes = [
  ...staticRoutes,
  ...serviceRoutes,
  ...serviceIndustryRoutes,
  ...industryRoutes,
  ...locationRoutes,
  ...areaRoutes,
  ...blogRoutes
];

console.log(`Starting pre-rendering for ${allRoutes.length} routes...`);

// Generate static files
allRoutes.forEach(route => {
  const seo = getSeoForPathname(route);
  const jsonLd = generateJsonLd(seo);
  
  // Render the exact React component tree into string
  let appHtml = '';
  try {
    appHtml = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [route] },
        React.createElement(AppContent)
      )
    );
  } catch (error) {
    console.error(`Error rendering route ${route}:`, error);
    // Fallback to empty string if a component fails
    appHtml = '';
  }

  // Handle robots directive (request-quote has noindex)
  const robotsDirective = (route === '/request-quote' || route.startsWith('/u/'))
    ? '<meta name="robots" content="noindex,follow" />'
    : '<meta name="robots" content="index,follow" />';

  // Generate complete Meta block
  const metaBlock = `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    ${robotsDirective}
    <link rel="canonical" href="${seo.canonical}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${seo.canonical}" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" />
    <script type="application/ld+json" id="json-ld-seo-schema">${JSON.stringify(jsonLd)}</script>
  `;

  // Inject metaBlock into base template head
  let content = stripSeoHeadTags(baseTemplate);
  
  content = content.replace('</head>', `${metaBlock}\n</head>`);

  // Inject rendered React HTML block into <div id="root"></div>
  content = content.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  // Write file to destination
  if (route === '/') {
    // Overwrite the main index.html in dist
    fs.writeFileSync(BASE_TEMPLATE_PATH, content, 'utf-8');
    console.log(`Pre-rendered: / -> dist/index.html`);
  } else {
    // Create subfolder and write index.html inside it
    const subPath = route.startsWith('/') ? route.slice(1) : route;
    const targetFolder = path.join(DIST_DIR, subPath);
    
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    
    fs.writeFileSync(path.join(targetFolder, 'index.html'), content, 'utf-8');
    console.log(`Pre-rendered: ${route} -> dist/${subPath}/index.html`);
  }
});

// Generate sitemap.xml dynamically from public active routes
console.log('Generating sitemap.xml...');
const sitemapRoutes = allRoutes.filter(route => {
  const isExcluded = 
    route.includes('/admin') || 
    route.includes('/dashboard') || 
    route.includes('/login') || 
    route.startsWith('/u/') || 
    route === '/request-quote';
  return !isExcluded;
});

const lastmod = new Date().toISOString().split('T')[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

sitemapRoutes.forEach(route => {
  const url = `${siteConfig.siteUrl}${route === '/' ? '' : route}`;
  const changefreq = route === '/' ? 'daily' : 'weekly';
  const priority = route === '/' ? '1.0' : route.startsWith('/services/') ? '0.8' : '0.6';
  
  sitemapXml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

sitemapXml += `\n</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('Dynamic sitemap.xml generated successfully!');

// Generate robots.txt dynamically using central siteUrl
console.log('Generating robots.txt...');
const robotsTxt = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /u/

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('robots.txt generated successfully!');

// Generate Netlify redirects so prerendered HTML wins before the SPA fallback.
console.log('Generating _redirects...');
const redirectLines = [
  '/robots.txt     /robots.txt     200',
  '/sitemap.xml    /sitemap.xml    200',
  ...allRoutes
    .filter(route => route !== '/')
    .map(route => `${route}    ${route}/index.html    200`),
  '/u/*    /index.html    200',
  '/*    /index.html    200'
];
fs.writeFileSync(path.join(DIST_DIR, '_redirects'), `${redirectLines.join('\n')}\n`, 'utf-8');
console.log('_redirects generated successfully!');

console.log('Pre-rendering completed successfully!');
