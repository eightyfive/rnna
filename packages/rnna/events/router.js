import { fromEvent } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { exec } from '@rnna/rx/operators';

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
    take(1),
    switchMap(() =>
      state$.pipe(
        exec(state => {
          router.rerender(state);
        }),
      ),
    ),
  );

export default [render, rerender];