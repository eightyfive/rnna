import produce from 'immer';
import { produceTableOrder, produceTables } from '@rnna/db';

const initialState = {
  tables: {},
  orders: {},
};

export function createDbReducer(reducer, getOrderName = i => i) {
  return produce((draft, action) => {
    const { entities, result } = action.payload;

    if (entities) {
      produceTables(draft.tables, entities);
    }

    if (Array.isArray(result)) {
      produceTableOrder(draft.orders, getOrderName(action.type), result);
    }

    return reducer(draft, action);
  }, initialState);
}
