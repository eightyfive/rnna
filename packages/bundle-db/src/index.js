import { Bundle } from 'rnna';
import Db from '@rnna/db';
import reducer from '@rnna/db/reducer';

export default class DbProvider extends Bundle {
  register(container) {
    container.service('db', createDb, 'db.*');
  }

  boot(services, store) {
    services.db.setStore(store);
  }

  getReducers() {
    return {
      db: reducer,
    };
  }
}

function createDb({ schemas, selectors }) {
  const db = new Db();

  Object.assign(db, selectors);

  Object.values(schemas).forEach(schema => {
    db.addTable(schema);
  });

  return db;
}
