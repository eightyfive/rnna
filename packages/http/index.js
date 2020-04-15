import { fromFetch } from 'rxjs/fetch';
import { startWith } from 'rxjs/operators';

import Http from 'fetch-run';

export default class HttpRx extends Http {
  static getKernel() {
    return req => fromFetch(req).pipe(startWith(req));
  }
}
