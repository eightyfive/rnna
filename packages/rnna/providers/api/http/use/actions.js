import parseUrl from 'url-parse';
import { merge, of } from 'rxjs';
import { catchError, filter, map, withLatestFrom } from 'rxjs/operators';

const reAjaxError = /^Ajax(?:Timeout)?Error$/;

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
    map(([res, req]) => {
      const { pathname } = parseUrl(req.url);
      const data = res.response.data || res.response;

      return {
        type: pathname.substring(1),
        payload: data,
        meta: {
          req,
          res,
        },
      };
    }),

    // Error action
    catchError(err => {
      if (!reAjaxError.test(err.name)) {
        throw err;
      }

      const req = err.request;

      const { pathname } = parseUrl(req.url);

      return of({
        type: pathname.substring(1),
        payload: err,
        error: true,
        meta: {
          req,
          res: err.response,
        },
      });
    }),
  );

  return merge(reqAction$, resAction$);
};

export default actions;
