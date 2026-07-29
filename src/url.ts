import { siteConfig } from './siteConfig';

const fileExtensionPattern = /\/[^/?#]+\.[a-z0-9]+$/i;

export function toTrailingSlashPath(value: string): string {
  if (!value || value === '/') return '/';

  const [pathAndQuery, hash = ''] = value.split('#', 2);
  const [pathname, query = ''] = pathAndQuery.split('?', 2);

  if (!pathname.startsWith('/') || fileExtensionPattern.test(pathname)) return value;

  return `${pathname.endsWith('/') ? pathname : `${pathname}/`}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export function toTrailingSlashUrl(pathname: string): string {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  return `${base}${toTrailingSlashPath(pathname)}`;
}

export function normalizeInternalHref(href: string): string {
  if (!href || href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) {
    return href;
  }

  if (href.startsWith('/')) return toTrailingSlashPath(href);

  try {
    const url = new URL(href);
    if (url.origin !== siteConfig.siteUrl) return href;
    return toTrailingSlashUrl(`${url.pathname}${url.search}${url.hash}`);
  } catch {
    return href;
  }
}

export function withUrlFragment(url: string, fragment: string): string {
  return `${url.endsWith('/') ? url : `${url}/`}#${fragment}`;
}
