import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.name === 'index.html') htmlFiles.push(fullPath);
  }
}

function routeFor(filePath) {
  const relative = path.relative(distDir, path.dirname(filePath)).replaceAll('\\', '/');
  return relative ? `/${relative}` : '/';
}

walk(distDir);
const routes = new Set(htmlFiles.map(routeFor));
const outgoing = new Map([...routes].map((route) => [route, new Set()]));
const incoming = new Map([...routes].map((route) => [route, 0]));
const brokenLinks = [];

for (const filePath of htmlFiles) {
  const sourceRoute = routeFor(filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#?]+)["']/gi)) {
    const target = match[1].replace(/\/$/, '') || '/';
    if (!target.startsWith('/')) continue;
    if (!routes.has(target)) {
      brokenLinks.push({ source: sourceRoute, target });
      continue;
    }
    if (target !== sourceRoute) outgoing.get(sourceRoute).add(target);
  }
}

for (const targets of outgoing.values()) {
  for (const target of targets) incoming.set(target, (incoming.get(target) ?? 0) + 1);
}

const pages = [...routes].map((route) => ({
  route,
  outgoingInternalLinks: outgoing.get(route).size,
  incomingInternalLinks: incoming.get(route),
}));
const byOutgoing = [...pages].sort((left, right) => left.outgoingInternalLinks - right.outgoingInternalLinks || left.route.localeCompare(right.route));
const byIncoming = [...pages].sort((left, right) => left.incomingInternalLinks - right.incomingInternalLinks || left.route.localeCompare(right.route));
const report = {
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  totalInternalLinks: pages.reduce((sum, page) => sum + page.outgoingInternalLinks, 0),
  brokenLinks,
  lowestLinkedPages: byIncoming.slice(0, 10),
  highestLinkedPages: [...byIncoming].reverse().slice(0, 10),
  pagesNeedingSupport: pages.filter((page) => page.incomingInternalLinks < 4 || page.outgoingInternalLinks < 18),
  pages,
};

fs.writeFileSync(path.join(distDir, 'internal-link-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Internal link report: ${report.totalInternalLinks} unique links across ${report.pageCount} pages.`);
console.log(`Pages needing support: ${report.pagesNeedingSupport.length}; broken links: ${report.brokenLinks.length}.`);

if (brokenLinks.length > 0) process.exitCode = 1;
