import { fromEvent } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { exec } from '../rx/operators';

const render = (action$, state$, { router }) =>
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
