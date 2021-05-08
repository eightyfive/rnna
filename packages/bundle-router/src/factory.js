import { Utils } from '@rnna/navigator';

import Router from './Router';

export default function createRouter(routes) {
  const [layouts, modals, overlays] = Utils.createLayouts(routes);

  const router = new Router(layouts, config);

  modals.forEach((modal, name) => {
    router.addModal(name, modal);
  });

  overlays.forEach((overlay, name) => {
    router.addOverlay(name, overlay);
  });

  return router;
}
