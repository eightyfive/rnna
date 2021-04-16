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

export default function createApi({ url, options }) {
  const api = new Http(url, options);

  // Error middleware to throw HTTP errors (>= 400)
  api.use(uses.error);

  // Emits both `req` & `res`
  api.use(next => req$ => merge(req$, next(req$)));

  // Emits req, res & err actions
  api.use(useActions());

  return api;
}

const useActions = next => oldReq$ => {
  const rr$ = next(oldReq$);

  const req$ = rr$.pipe(
    take(1),
    // Emit request action
    map(req => {
      const { pathname } = parseUrl(req.url);

      return {
        type: pathname.substring(1),
        meta: {
          req,
          res: null,
        },
      };
    }),
  );

  const res$ = rr$.pipe(
    skip(1),
    filter(res => res.headers.get('Content-Type') === 'application/json'),
    withLatestFrom(req$),

    // Emit response action
    switchMap(([res, req]) => {
      return from(res.json()).pipe(
        map(json => {
          const { pathname } = parseUrl(req.url);

          return {
            type: pathname.substring(1),
            payload: json.data || json,
            meta: {
              req,
              res,
            },
          };
        }),
      );
    }),

    // Emit error action
    catchError(err =>
      of(err).pipe(
        filter(err => Boolean(err.response)),
        switchMap(err =>
          from(err.response.json()).pipe(
            map(json => {
              const req = err.request;
              const res = err.response;

              const { pathname } = parseUrl(req.url);

              err.data = json.data || json;

              // Emit error
              return {
                type: pathname.substring(1),
                payload: err,
                error: true,
                meta: {
                  req,
                  res,
                },
              };
            }),
          ),
        ),
      ),
    ),
  );

  return merge(req$, res$);
};
