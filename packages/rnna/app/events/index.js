import { AppState } from 'react-native';
import { fromEvent, empty } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { exec, ofType } from '@rnna/rx/operators';

import events from '../../../../app/events';
import { mapResult } from '../../events';

const epics = [];

// Router
const render = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      fromEvent(router, '_didAppear').pipe(
        exec(({ componentId: id }) => {
          router.render(router.get(id), state$.value);
        }),
      ),
    ),
  );

const rerender = (action$, state$, { router }) =>
  action$.pipe(
    exec(() => {
      router.rerender(state$.value);
    }),
  );

// Register
const onRegister = (action$, state$, services) =>
  action$.pipe(
    take(1),
    switchMap(() => {
      const result = events.register(services);

      return mapResult(result);
    }),
  );

// Boot
const onBoot = (action$, state$, services) =>
  action$.pipe(
    ofType('[RNNA] Boot'),
    take(1),
    switchMap(() => {
      const result = events.boot(state$.value, services);

      return mapResult(result);
    }),
  );

// App state
const onAppState = (action$, state$, services) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      fromEvent(AppState, 'change').pipe(
        switchMap(name => {
          let callback;

          if (name === 'active' && events.foreground) {
            callback = events.foreground;
          } else if (name === 'background' && events.background) {
            callback = events.background;
          }

          if (callback) {
            const result = callback(state$.value, services);

            return mapResult(result);
          }

          return empty();
        }),
      ),
    ),
  );

// Api
const onApi = (action$, state$, services) =>
  action$.pipe(
    mergeMap(action => {
      const req = events.api(action, state$.value, services);

      if (req) {
        return fromApi(req);
      }

      return empty();
    }),
  );

epics.push(render, rerender);

if (events.register) {
  epics.push(onRegister);
}

if (events.boot) {
  epics.push(onBoot);
}

if (events.foreground || events.background) {
  epics.push(onAppState);
}

if (events.api) {
  epics.push(onApi);
}

export default epics;
