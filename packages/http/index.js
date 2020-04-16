import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

import Http from 'fetch-run';

export default class HttpRx extends Http {
  constructor(baseUri, options = {}) {
    super(baseUri, options);

    this.stack = req$ => req$.pipe(switchMap(req => fromFetch(req)));
  }

  run(req) {
    return this.stack(of(req));
  }
}
