import { Bundle } from 'rnna';
import Db from '@rnna/db';
import createReducer from '@rnna/db/reducer';

export default class DbProvider extends Bundle {
  constructor(options = {}) {
    this.reducer = options.reducer === false ? false : true;
  }

  register(container) {
    container.service('db', createDb, 'db.*');
  }

  boot(services, store) {
    services.db.setStore(store);
  }

  getReducers() {
    if (this.reducer) {
      return {
        db: createReducer(),
      };
    }

    return {};
  }
}

function createDb({ schemas = {}, selectors = {} }) {
  const db = new Db();

  Object.assign(db, selectors);

  Object.values(schemas).forEach(schema => {
    db.addTable(schema);
  });

  return db;
}
