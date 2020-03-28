import { tap, withLatestFrom } from 'rxjs/operators';

import HttpError from 'fetch-run/http-error';

const error = next => req$ =>
  next(req$).pipe(
    withLatestFrom(req$),
    tap(([res, req]) => {
      if (!res.ok) {
        throw new HttpError(
          res.status,
          res.statusText,
          req.clone(),
          res.clone(),
        );
      }
    }),
  );

export default error;
