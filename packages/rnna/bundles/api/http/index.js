import Http from '@rnna/http';
import error from '@rnna/http/use/error';

import actions from './use/actions';

export default function createHttp({ url, options }) {
  const http = new Http(url, options);

  http.use(error);
  http.use(actions);

  return http;
}
