import { fromFetch } from 'rxjs/fetch';
import { startWith } from 'rxjs/operators';

import Http from 'fetch-run';

export default class HttpRx extends Http {
  constructor(baseUri, options = {}) {
    super(baseUri, options);

    this.run = req => fromFetch(req).pipe(startWith(req));
  }
}
