import { createSwitch } from '@rnna/navigator';

import Router from './Router';

export default function createRouter(routes) {
  const root = createSwitch(routes);

  return new Router(root);
}
