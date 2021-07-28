import parseUrl from 'url-parse';
import { merge, of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';

const reAjaxError = /^Ajax(?:Timeout)?Error$/;

const actions = next => req$ => {
  const res$ = next(req$);

  const reqAction$ = req$.pipe(
    map(req => {
      const url = parseUrl(req.url);

      // Req action
      return {
        type: 'http/req',
        meta: {
          req,
          res: null,
          url,
        },
      };
    }),
  );

  const resAction$ = res$.pipe(
    withLatestFrom(req$),

    map(([res, req]) => {
      const url = parseUrl(req.url);
      const data = (res.response || {}).data || res.response;

      // Res action
      return {
        type: 'http/res',
        payload: data,
        meta: {
          req,
          res,
          url,
        },
      };
    }),

    catchError(err => {
      if (!reAjaxError.test(err.name)) {
        throw err;
      }

      const req = err.request;

      const url = parseUrl(req.url);

      // Err action
      return of({
        type: 'http/error',
        payload: err,
        error: true,
        meta: {
          req,
          res: err.response,
          url,
        },
      });
    }),
  );

  return merge(reqAction$, resAction$);
};

export default actions;
