import { tap } from 'rxjs/operators/tap';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

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
