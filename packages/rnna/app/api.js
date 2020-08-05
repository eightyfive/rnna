import Http from '@rnna/http';
import * as uses from '@rnna/http/use';
import { merge } from 'rxjs';

export default function createApi({ url, options }) {
  const api = new Http(url, options);

  // Error middleware to throw HTTP errors (>= 400)
  api.use(uses.error);

  // Emits both `req` & `res` (for `mapApi` operator to work)
  api.use(next => req$ => merge(req$, next(req$)));

  return api;
}
