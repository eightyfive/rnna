import { produceTableOrder, produceTables } from '@rnna/db';
import produce from 'immer';

import { parseApiType } from '../utils';

const initialState = {
  tables: {},
  orders: {},
};

function getResourceName({ type, url }) {
  if (url) {
    return url.replace('/', '').replace(/\//g, '-');
  }

  return type;
}

export function createDbReducer(reducer, getOrderName = getResourceName) {
  return produce((draft, { type, payload }) => {
    const { entities, result } = payload || {};

    if (entities) {
      produceTables(draft.tables, entities);
    }

    const [method, url, status] = parseApiType(type);
    const data = { type, payload, method, url, status };

    if (Array.isArray(result)) {
      produceTableOrder(draft.orders, getOrderName(data), result);
    }

    return reducer(draft, data);
  }, initialState);
}

export function createHttpReducer(reducer) {
  return produce((draft, { type, payload }) => {
    const [method, url, status] = parseApiType(type);
    const data = { type, payload, method, url, status };

    return reducer(draft, data);
  }, initialState);
}
