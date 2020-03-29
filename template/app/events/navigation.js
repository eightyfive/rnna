import { exec, ofType } from 'rnna/operators';

import { navigator } from '../services';

export const run = ev =>
  ev.pipe(
    ofType('[App] Storage synched'),
    exec(() => navigator.go('Hello')),
  );
