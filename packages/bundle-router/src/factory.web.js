import { Utils } from '@rnna/navigator';

import Router from './Router';

export default function createRouter(routes) {
  const components = Utils.createComponents(routes);

  return new Router(components);
}
