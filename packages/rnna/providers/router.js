import { fromEvent } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import _isObject from 'lodash.isplainobject';
import _mapValues from 'lodash.mapvalues';
import {
  createBottomTabsNavigator,
  createOverlayNavigator,
  createStackNavigator,
} from '@rnna/navigator';

import Provider from '../provider';
import Router, { getRouteDepth } from '../navigation/Router';
import { exec } from '../rx/operators';

class RouterProvider extends Provider {
  constructor(routes) {
    super();

    this.routes = routes;
  }

  register(services, reducers, epics) {
    const screens = findScreens(this.routes, new Map());
    const router = new Router(createRoutes(this.routes), screens, services);

    Object.assign(services, { router });

    epics.unshift(render$, rerender$);
  }
}

const render$ = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      fromEvent(router, 'ComponentDidAppear').pipe(
        exec(({ componentId: id }) => {
          router.render(router.get(id), state$.value);
        }),
      ),
    ),
  );

const rerender$ = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      state$.pipe(
        exec(state => {
          router.rerender(state);
        }),
      ),
    ),
  );

function findScreens(routes, screens, parentId = null) {
  for (const [key, route] of Object.entries(routes)) {
    if (key === 'options' || key === 'config') {
      continue;
    }

    const id = parentId ? `${parentId}/${key}` : key;

    if (_isObject(route)) {
      findScreens(route, screens, id);
    } else {
      screens.set(id, route);
    }
  }

  return screens;
}

function createRoutes(routes) {
  return _mapValues(routes, (route, id) => {
    const isOverlay = !_isObject(route);

    if (isOverlay) {
      return createOverlayNavigator(id, route);
    }

    const { options = {}, config = {}, ...screens } = route;
    const depth = getRouteDepth(route);

    config.parentId = id;

    if (depth === 1) {
      return createBottomTabsNavigator(screens, options, config);
    }

    if (depth === 0) {
      return createStackNavigator(screens, options, config);
    }

    throw new Error('Invalid routes obj');
  });
}

export default function createRouter(routes) {
  return new RouterProvider(routes);
}
