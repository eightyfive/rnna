import { exec, ofHTTPErrorType, ofType } from 'rnna/operators';

import { navigator } from '../services';

export const auth = ev =>
  ev.pipe(
    ofType('[App] Unauthenticated'),
    exec(() => navigator.go('auth')),
  );

export const main = ev =>
  ev.pipe(
    ofType('[App] Authenticated', '[API] POST /login 200'),
    exec(() => navigator.go('main')),
  );

export const logout = ev =>
  ev.pipe(
    ofHTTPErrorType(401),
    exec(() => {
      navigator.dismissAllOverlays();
      navigator.dismissAllModals();

      navigator.go('auth');
    }),
  );
