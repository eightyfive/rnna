import Http from '@rnna/http';

import actions from './use/actions';

export default function createHttp(defaults) {
  const http = new Http(defaults);

  http.use(actions);

  return http;
}
