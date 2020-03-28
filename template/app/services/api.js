import { Platform } from 'react-native';
import Http from 'rnna/http';
import error from 'rnna/http/use/error';
import logger from 'rnna/http/use/logger';

import { api as config } from '../config';

const api = new Http(config.url, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Platform': Platform.OS,
  },
});

if (__DEV__) {
  api.use(logger);
}

api.use(error);

export default api;

