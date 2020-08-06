import Http from '@rnna/http';
import * as uses from '@rnna/http/use';
import { merge } from 'rxjs';

import createActions from '../http/actions';
import { parseUrl, interpolate } from '../utils';

export default function createApi({ url, options, action }) {
  const api = new Http(url, options);

  // Error middleware to throw HTTP errors (>= 400)
  api.use(uses.error);

  // Emits both `req` & `res` (for `mapApi` operator to work)
  api.use(next => req$ => merge(req$, next(req$)));

  api.use(createActions(createCreateType(action)));

  return api;
}

function createCreateType({ template, urlPrefix = '' }) {
  return ({ method, status, url }) => {
    const { pathname, search } = parseUrl(url);
    const verb = method === 'GET' && search ? 'SEARCH' : method;

    return interpolate(template, {
      method: verb,
      url: pathname.replace(urlPrefix, ''),
      status,
    });
  };
}
