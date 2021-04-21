import Bundle from '../../bundle';
import db from './db';
import events from './events';

class DbBundle extends Bundle {
  constructor(selectors) {
    super();

    this.db = db;

    Object.assign(this.db, selectors);
  }

  register(services, reducers, epics) {
    Object.assign(services, { db: this.db });

    epics.unshift(...events);
  }
}

export default function bundleDb(selectors) {
  return new DbBundle(selectors);
}
