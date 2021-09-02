import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';

export const createFind = schema =>
  createCachedSelector(
    (state, id) => id,
    state => state.db.tables,
    (id, entities) => denormalize(id, schema, entities),
  )((state, id) => id);

export const createGet = schema =>
  createSelector(
    state => state.db.orders[schema.key],
    state => state.db.tables,
    (result, entities) => denormalize(result || [], [schema], entities),
  );
