import parseUrl from 'url-parse';
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
import Http from '@rnna/http';
import * as uses from '@rnna/http/use';

function createApiType({ method, status, url }) {
  const { pathname, search } = parseUrl(url);

  const verb = method === 'GET' && search ? 'SEARCH' : method;
  const path = pathname.replace('/api', '');

  return `[API] ${verb} ${path} ${status}`;
}

export default function createApi({
  url,
  options,
  createActionType = createApiType,
}) {
  const api = new Http(url, options);

  // Error middleware to throw HTTP errors (>= 400)
  api.use(uses.error);

  // Emits both `req` & `res`
  api.use(next => req$ => merge(req$, next(req$)));

  api.use(createUseActions(createActionType));

  return api;
}

const createUseActions = createType => next => oldReq$ => {
  const rr$ = next(oldReq$);

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
    switchMap(([res, req]) => {
      return from(
        res.json().then(json => ({
          method: req.method,
          url: req.url,
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

  return merge(req$, res$).pipe(
    map(re => createHttpAction(createType(re), re)),
  );
};

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
