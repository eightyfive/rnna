import {
  createBottomTabs,
  createModal,
  createStack,
  Layouts,
  Utils,
} from '@rnna/navigator';

import Router from './Router';

export default function createRouter(routes, config = {}) {
  const [bottomTabs, modals, overlays, stacks] = Utils.resolveLayouts(routes);

  const layouts = {};

  bottomTabs.forEach((args, name) => {
    layouts[name] = createBottomTabs(...args);
  });

  stacks.forEach((args, name) => {
    layouts[name] = createStack(...args);
  });

  const router = new Router(layouts, config);

  modals.forEach((args, name) => {
    router.addModal(name, createModal(...args));
  });

  overlays.forEach((args, name) => {
    router.addOverlay(name, new Layouts.Overlay(...args));
  });

  return router;
}
