import { switchMap, take } from 'rxjs/operators';

import { exec } from '../../rx/operators';

const onState$ = (action$, state$, { db }) =>
  action$.pipe(
    take(1),
    switchMap(() =>
      state$.pipe(
        exec(state => {
          db.setState(state);
        }),
      ),
    ),
  );

export default [onState$];
