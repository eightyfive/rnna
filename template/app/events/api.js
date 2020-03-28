import { Alert } from 'react-native';
import { exec, mapApi, ofHTTPErrorType, ofType } from 'rnna/operators';

import { api } from '../services';

// Session
export const login = ev =>
  ev.pipe(
    ofType('[Login] Submit'),
    mapApi(api, 'POST', 'login', data => data),
  );

export const register = ev =>
  ev.pipe(
    ofType('[Register] Submit'),
    mapApi(api, 'POST', 'register', data => data),
  );

// User
export const getUser = ev =>
  ev.pipe(
    ofType(
      '[App] Authenticated',
      '[API] POST /login 200',
      '[API] POST /register 200',
    ),
    mapApi(api, 'GET', 'user'),
  );

// Error
export const onForbidden = (ev, state$) =>
  ev.pipe(
    ofHTTPErrorType(403),
    exec(() => Alert.alert('Oops', 'An error occured')),
  );
