import { createRoot } from '@rnna/navigator';

import Router from './Router';

export default function createRouter(routes) {
  const root = createRoot(routes);

  return new Router(root);
}
