import { from, of, merge } from 'rxjs';
import {
  catchError,
  filter,
  map,
  skip,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';

export const fromApi = rr$ => {
  const req$ = rr$.pipe(
    take(1),
    // Emit request
    map(req => ({ method: req.method, url: req.url, status: 202 })),
  );

  const res$ = rr$.pipe(
    skip(1),
    isContentType('application/json'),
    withLatestFrom(req$),

    // Emit response
    switchMap(([res, { method, url }]) => {
      return from(
        res.json().then(json => ({
          method,
          url,
          status: res.status,
          json,
        })),
      );
    }),

    // Catch HTTP Error
    catchError(err => of(err).pipe(isHTTPError(), mapError())),
  );

  return merge(req$, res$);
};

const isContentType = contentType => source =>
  source.pipe(filter(re => re.headers.get('Content-Type') === contentType));

const isHTTPError = () => source =>
  source.pipe(filter(err => Boolean(err.response)));

const mapError = () => source =>
  source.pipe(
    switchMap(err =>
      from(
        err.response.json().then(data => {
          const req = err.request;
          const res = err.response;

          err.data = data;

          // Emit error
          return {
            method: req.method,
            url: req.url,
            status: res.status,
            err,
          };
        }),
      ),
    ),
  );
