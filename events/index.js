import { AppState } from 'react-native';
import { fromEventPattern } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { mapAction, ofType } from '../operators';

export const appState = action$ =>
  action$.pipe(
    ofType('[App] Storage synched'),
    switchMap(() =>
      fromEventPattern(
        handler => AppState.addEventListener('change', handler),
        handler => AppState.removeEventListener('change', handler),
      ).pipe(
        filter(state => /(active|background)/.test(state)),
        mapAction(state =>
          state === 'active' ? '[App] Foreground' : '[App] Background',
        ),
      ),
    ),
  );
