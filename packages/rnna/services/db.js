import db, { createSelector } from '@rnna/db';

export { createSelector };

const o = Object;

export default function createDb(entities) {
  for (const [key, schema] of o.entries(entities)) {
    db.addEntity(key, schema);
  }

  return db;
}
