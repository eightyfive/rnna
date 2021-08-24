export { default } from './http';

import actions from './use/actions';
import error from './use/error';
import response from './use/response';

export const uses = {
  actions,
  error,
  response,
};
