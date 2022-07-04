import { error, logger } from 'fetch-run/use';

import { Api } from './api';

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export function createApi(url: string, options?: RequestInit) {
  const api = new Api(url, Object.assign(defaultOptions, options));

  api.use(error);

  if (__DEV__) {
    api.use(logger);
  }

  return api;
}
