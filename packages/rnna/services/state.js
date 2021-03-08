import produce from 'immer';

import { parseApiType } from '../utils';

export { produceTableOrder, produceTables } from '@rnna/db';

export function createReducer(reducer, initialState = {}) {
  return produce((draft, { type, payload }) => {
    const action = { type, payload };

    const [method, pathname, status] = parseApiType(type);

    if (method && pathname && status) {
      action.meta = { http: true, method, pathname, status };
    }

    return reducer(draft, action);
  }, initialState);
}
