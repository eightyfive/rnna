import Bundle from 'rnna/bundle';

import createDb from './db';
import events from './events';

class DbBundle extends Bundle {
  constructor(selectors) {
    super();

    this.db = createDb(selectors);
  }

  register(services, reducers, epics) {
    Object.assign(services, { db: this.db });

    epics.unshift(...events);
  }
}

export default function bundleDb(selectors) {
  return new DbBundle(selectors);
}
