import fs from 'node:fs';
import path from 'node:path';
import { getSearchConsoleOptimization } from '../src/searchConsoleOptimization';

const distDir = path.resolve('dist');
const htmlFiles: string[] = [];

function walk(directory: string) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.name === 'index.html') htmlFiles.push(fullPath);
  }
}

function routeFor(filePath: string) {
  const relative = path.relative(distDir, path.dirname(filePath)).replaceAll('\\', '/');
  return relative ? `/${relative}` : '/';
}

function decodeHtml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function textContent(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function matchValue(html: string, expression: RegExp) {
  const match = expression.exec(html);
  return match ? decodeHtml(match[1]) : '';
}

function pageType(route: string) {
  if (route.startsWith('/blog/')) return 'blog-article';
  if (route.startsWith('/case-studies/')) return 'case-study';
  if (route.startsWith('/services/') && route.split('/').length > 3) return 'service-industry';
  if (route.startsWith('/services/')) return 'service';
  if (route.startsWith('/industries/')) return 'industry';
  if (route.startsWith('/locations/') && route.split('/').length > 3) return 'independent-area';
  if (route.startsWith('/locations/')) return 'location';
  return 'static';
}

function characterCount(value: string) {
  return [...value].length;
}

walk(distDir);

const internalLinkReportPath = path.join(distDir, 'internal-link-report.json');
const internalLinkReport = JSON.parse(fs.readFileSync(internalLinkReportPath, 'utf8')) as {
  pages: Array<{ route: string; outgoingInternalLinks: number }>;
};
const linksByRoute = new Map(internalLinkReport.pages.map((page) => [page.route, page.outgoingInternalLinks]));

const pages = htmlFiles.map((filePath) => {
  const route = routeFor(filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const title = textContent(matchValue(html, /<title>([\s\S]*?)<\/title>/i));
  const metaDescription = matchValue(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  const h1 = textContent(matchValue(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  const canonical = matchValue(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
  const optimization = getSearchConsoleOptimization(route);
  const titleLength = characterCount(title);
  const metaDescriptionLength = characterCount(metaDescription);
  const titleIssue = titleLength < 30 ? 'too-short' : titleLength > 65 ? 'too-long' : null;
  const metaDescriptionIssue = metaDescriptionLength < 70 ? 'too-short' : metaDescriptionLength > 165 ? 'too-long' : null;
  const keywordPlacement = optimization
    ? title.startsWith(optimization.targetKeyword) ? 'starts-with-target-keyword' : 'target-keyword-not-at-start'
    : 'pending-search-console-keyword';
  const onPageReady = Boolean(title && metaDescription && h1 && canonical) && !titleIssue && !metaDescriptionIssue;

  return {
    route,
    pageType: pageType(route),
    title,
    titleLength,
    metaDescription,
    metaDescriptionLength,
    h1,
    canonical,
    internalLinkCount: linksByRoute.get(route) ?? 0,
    targetKeyword: optimization?.targetKeyword ?? null,
    secondaryKeywords: optimization?.secondaryKeywords ?? [],
    searchIntent: optimization?.searchIntent ?? null,
    keywordPlacement,
    ctrReadiness: onPageReady ? 'ready-for-search-console-data' : 'needs-on-page-review',
    titleIssue,
    metaDescriptionIssue,
  };
}).sort((left, right) => left.route.localeCompare(right.route));

const report = {
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  configuredKeywordCount: pages.filter((page) => page.targetKeyword).length,
  titleIssues: pages.filter((page) => page.titleIssue),
  metaDescriptionIssues: pages.filter((page) => page.metaDescriptionIssue),
  keywordPlacementPending: pages.filter((page) => page.keywordPlacement === 'pending-search-console-keyword'),
  pagesNeedingFutureCtrReview: pages.filter((page) => page.ctrReadiness === 'ready-for-search-console-data'),
  pages,
};

fs.writeFileSync(path.join(distDir, 'search-console-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Search Console report: ${report.pageCount} pages; ${report.titleIssues.length} title issues; ${report.metaDescriptionIssues.length} meta description issues.`);
