import { empty, from, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  skip,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { ofHTTPErrorType, ofType } from '@rnna/rx/operators';

import { parseUrl, tmpl } from '../utils';

export function on(...types) {
  const callback = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      ofType(...types),
      switchMap(action => {
        const result = callback(
          action.payload || action,
          state$.value,
          services,
        );

        return mapResult(result);
      }),
    );
  };
}

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

  return merge(req$, res$).pipe(map(apiAction));
};

const apiAction = ({ method, url, status, json, err }) => {
  // Type: "[API] GET /users 200"
  const { pathname, search } = parseUrl(url);
  const verb = method === 'GET' && search ? 'SEARCH' : method;

  const type = tmpl('[API] {method} {url} {status}', {
    method: verb,
    url: pathname.replace('/api', ''),
    status,
  });

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

export const mapApi = callback => source =>
  source.pipe(
    switchMap(action =>
      fromApi(callback(action ? action.payload || action : undefined)),
    ),
  );

export function onHTTPErrorType(code, callback) {
  return (action$, state$, services) =>
    action$.pipe(
      ofHTTPErrorType(code),
      switchMap(action => mapResult(callback, action, state$, services)),
    );
}

export function mapResult(result) {
  if (typeof result === 'undefined') {
    return empty();
  }

  if (typeof result === 'string') {
    return of({ type: result });
  }

  if (Array.isArray(result)) {
    const [type, payload] = result;

    return of({ type, payload });
  }

  // Observable
  return result;
}
