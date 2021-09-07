export { default } from './http';

import actions from './use/actions';
import error from './use/error';
import log from './use/log';
import response from './use/response';

export const uses = {
  actions,
  error,
  log,
  response,
};
