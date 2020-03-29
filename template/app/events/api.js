import { Alert } from 'react-native';
import { exec, ofHTTPErrorType, ofType } from 'rnna/operators';

import { api } from '../services';
import { mapApi } from '../helpers';

// Session
export const login = ev =>
  ev.pipe(
    ofType('[Login] Submit'),
    mapApi(data => api.post('login', data)),
  );

export const register = ev =>
  ev.pipe(
    ofType('[Register] Submit'),
    mapApi(data => api.post('register', data)),
  );

// User
export const getUser = ev =>
  ev.pipe(
    ofType(
      '[App] Authenticated',
      '[API] POST /login 200',
      '[API] POST /register 200',
    ),
    mapApi(() => api.get('user')),
  );

// Error
export const onForbidden = (ev, state$) =>
  ev.pipe(
    ofHTTPErrorType(403),
    exec(() => Alert.alert('Oops', 'An error occured')),
  );
