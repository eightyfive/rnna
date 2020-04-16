import { map, tap, withLatestFrom } from 'rxjs/operators';

import HTTPError from 'fetch-run/http-error';

const error = next => req$ => {
  return next(req$).pipe(
    withLatestFrom(req$),
    tap(([res, req]) => {
      if (!res.ok) {
        throw new HTTPError(res.status, res.statusText, req, res.clone());
      }
    }),
    map(([res]) => res),
  );
};

export default error;
