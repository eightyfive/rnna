export { appState } from 'rnna/events';
import { exec, mapAction, ofHTTPErrorType, ofType } from 'rnna/operators';
import { filter } from 'rxjs/operators';

import { db } from '../services';

export const run = (ev, state$) =>
  ev.pipe(
    ofType('[App] Storage synched'),
    mapAction(() => {
      const token = db.getToken(state$.value);

      return token ? '[App] Authenticated' : '[App] Unauthenticated';
    }),
  );

export const onToken = (ev, state$) =>
  ev.pipe(
    ofType(
      '[App] Authenticated',
      '[API] POST /login 200',
      '[API] POST /register 200',
    ),
    exec(() => {
      const token = db.getToken(state$.value);

      // Api
      api.setBearer(token);
    }),
  );

export const onHTTP401 = ev =>
  ev.pipe(
    ofHTTPErrorType(401),
    exec(() => {
      api.setBearer(null);
    }),
  );
