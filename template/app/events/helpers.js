import { createMapApi } from 'rnna/operators';

function getPathname(url) {
  const [, ...segments] = url.replace(/^https?:\/\//, '').split('/');

  return segments.join('/');
}

function createApiType(method, url, status) {
  let verb = method;
  let pathname = getPathname(url).replace('api/', '');

  if (pathname.indexOf('?') > -1) {
    verb = 'SEARCH';
    pathname = pathname.split('?').shift();
  }

  return `[API] ${verb} /${pathname} ${status}`;
}

export const mapApi = createMapApi(createApiType);
