import { fromEvent } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { exec } from '../../rx/operators';

export const update$ = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      fromEvent(router, 'ComponentDidAppear').pipe(
        exec(({ componentId }) => {
          router.update(componentId);
        }),
      ),
    ),
  );

export const onState$ = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      state$.pipe(
        exec(state => {
          router.onState(state);
        }),
      ),
    ),
  );

export const go$ = (action$, state$, { router }) =>
  action$.pipe(
    filter(({ type }) => type.indexOf('go/') === 0),
    exec(({ type, payload: params = [] }) => {
      const componentId = type.replace('go/', '');

      router.go(componentId, params);
    }),
  );
