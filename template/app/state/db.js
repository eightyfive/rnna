import produce from 'immer';

const initialState = {
  users: {
    '1': { name: 'John' },
  },
};

export default produce((draft, { payload = {} }) => {
  const { entities } = payload;

  if (entities) {
    Object.keys(entities).forEach(table => {
      if (!draft[table]) {
        throw new Error(`Unknown table: ${table}`);
      }

      Object.keys(entities[table]).forEach(id => {
        const entity = entities[table][id];

        if (draft[table][id]) {
          // Merge
          Object.assign(draft[table][id], entity);
        } else {
          // Set
          draft[table][id] = entity;
        }
      });
    });
  }
}, initialState);
