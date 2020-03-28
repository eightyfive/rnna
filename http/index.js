import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap } from 'rxjs/operators';

import HttpStack from 'fetch-run/http-stack';

export default class Http extends HttpStack {
  getKernel() {
    return req$ => req$.pipe(switchMap(req => fromFetch(req)));
  }

  run(req) {
    return this.getStack().run(of(req));
  }
}
