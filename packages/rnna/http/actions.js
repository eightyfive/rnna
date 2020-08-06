import { from, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  skip,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';

const createActions = createType => next => rr$ => {
  const req$ = rr$.pipe(
    take(1),
    // Emit request
    map(req => ({ method: req.method, url: req.url, status: 202 })),
  );

  const res$ = rr$.pipe(
    skip(1),
    filter(res => res.headers.get('Content-Type') === 'application/json'),
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
    catchError(err =>
      of(err).pipe(
        filter(err => Boolean(err.response)),
        mapError(),
      ),
    ),
  );

  return next(
    merge(req$, res$).pipe(map(re => createHttpAction(createType(re), re))),
  );
};

export default createActions;

const createHttpAction = (type, { json, err }) => {
  // Error action
  if (err) {
    return {
      type,
      error: true,
      payload: err,
    };
  }

  // Response action
  if (json) {
    return {
      type,
      payload: json.data || json,
    };
  }

  // Request action
  return {
    type,
  };
};

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
