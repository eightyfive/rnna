const createSelectTable = key => state => state[key].table;

const createSelectOrder = key => state => state[key].order;

const createSelectRelations = relations => state => {
  const tables = {};

  relations.forEach(key => {
    tables[key] = state[key].table;
  });

  return tables;
};

export const createFind = (schema, relations) =>
  createSelector(
    createSelectTable(schema.key),
    createSelectRelations(relations),
    (table, id, tables) => {
      return table[id] ? denormalize(table[id], schema, tables) : null;
    },
  );

export const createGet = (schema, relations) =>
  createSelector(
    createSelectTable(schema.key),
    createSelectOrder(schema.key),
    createSelectRelations(relations),
    (table, order, tables) =>
      order.map(id => {
        return table[id] ? denormalize(table[id], schema, tables) : null;
      }),
  );
