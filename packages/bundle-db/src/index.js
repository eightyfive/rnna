import { Bundle } from 'rnna';
import Db from '@rnna/db';

export default class DbProvider extends Bundle {
  register(container) {
    container.service('db', createDb, 'db.*');
  }

  boot(services, store) {
    services.db.setStore(store);
  }
}

function createDb({ selectors }) {
  const db = new Db();

  Object.assign(db, selectors);

  return db;
}
