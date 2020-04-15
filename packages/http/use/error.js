import { merge } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';

import HTTPError from 'fetch-run/http-error';

const error = next => req => {
  const rr$ = next(req);

  // Req
  const req$ = rr$.pipe(take(1));

  // Res
  const res$ = rr$.pipe(
    skip(1),
    tap(res => {
      if (!res.ok) {
        throw new HTTPError(res.status, res.statusText, req, res.clone());
      }
    }),
  );

  return merge(req$, res$);
};

export default error;
