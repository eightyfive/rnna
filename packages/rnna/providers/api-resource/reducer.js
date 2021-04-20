import produce from 'immer';

const initialState = {
  table: {},
  order: [],
};

export default function createReducer(key) {
  return produce((draft, { type, payload = {}, meta = {} }) => {
    const { entities, result } = payload;
    const { req, res } = meta;

    if (res && res.ok && type === this.endpoint) {
      produceTable(draft, entities[key]);

      if (req.method === 'GET' && Array.isArray(result)) {
        produceOrder(draft, result);
      }
    }
  }, initialState);
}

function produceTable(draft, entities) {
  for (const [id, data] of Object.entries(entities)) {
    if (draft.table[id]) {
      // Merge
      Object.assign(draft.table[id], data);
    } else {
      // Set
      draft.table[id] = data;
    }
  }
}

function produceOrder(draft, result) {
  const changed =
    result.length !== draft.order.length ||
    result.some(id => !draft.order.includes(id));

  if (changed) {
    draft.order = result;
  }
}
