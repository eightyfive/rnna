import parseUrl from 'url-parse';
import { from, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

const actions = next => req$ => {
  const res$ = next(req$);

  const reqAction$ = req$.pipe(
    map(req => {
      const { pathname } = parseUrl(req.url);

      // Req action
      return {
        type: pathname.substring(1),
        meta: {
          req,
          res: null,
        },
      };
    }),
  );

  const resAction$ = res$.pipe(
    filter(res => res.headers.get('Content-Type') === 'application/json'),
    withLatestFrom(req$),

    // Res action
    switchMap(([res, req]) =>
      from(res.json()).pipe(
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
      ),
    ),

    // Error action
    catchError(err =>
      of(err).pipe(
        filter(err => {
          if (err.response) {
            return true;
          }

          // Re-throw if not HTTP error
          throw err;
        }),
        switchMap(err =>
          from(err.response.json()).pipe(
            map(json => {
              const req = err.request;
              const res = err.response;

              const { pathname } = parseUrl(req.url);

              err.data = json.data || json;

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

  return merge(reqAction$, resAction$);
};
