import Http from '@rnna/http';
import uses from '@rnna/http/use';

export default function createHttp(defaults) {
  const http = new Http(defaults);

  http.use(uses.actions);

  return http;
}
