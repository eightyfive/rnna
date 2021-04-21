import { switchMap, take } from 'rxjs/operators';

import { exec } from '../../rx/operators';

const onState$ = (action$, state$, { router }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      state$.pipe(
        exec(state => {
          router.onState();
        }),
      ),
    ),
  );

export default [onState$];
