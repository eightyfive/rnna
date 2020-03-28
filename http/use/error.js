import { tap, withLatestFrom } from 'rxjs/operators';

import HTTPError from 'fetch-run/http-error';

const error = next => req$ =>
  next(req$).pipe(
    withLatestFrom(req$),
    tap(([res, req]) => {
      if (!res.ok) {
        throw new HTTPError(
          res.status,
          res.statusText,
          req.clone(),
          res.clone(),
        );
      }
    }),
  );

export default error;
