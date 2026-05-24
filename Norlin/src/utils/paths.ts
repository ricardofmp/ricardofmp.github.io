const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

export function stripBase(pathname: string) {
  return base && pathname.startsWith(base)
    ? pathname.slice(base.length) || '/'
    : pathname;
}
