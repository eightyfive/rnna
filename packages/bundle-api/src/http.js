import Http, { uses } from '@rnna/http';
import { map } from 'rxjs/operators';

// const logResponse = next => req$ => {
//   const action$ = next(req$);

//   return action$.pipe(
//     tap(({ error = false, meta: { req, res, url } }) => {
//       if (!error && req && res) {
//         console.groupCollapsed(`${req.method} ${url.pathname} (${res.status})`);

//         console.log('req', req.body);
//         console.log('res', res.response);

//         console.groupEnd();
//       }
//     }),
//   );
// };

const renameActions = createActionType => next => req$ => {
  const action$ = next(req$);

  return action$.pipe(
    map(action => {
      const {
        error = false,
        meta: { req, res, url },
        payload,
      } = action;

      const status = error ? payload.status : res ? res.status : 202;

      return {
        ...action,
        type: createActionType(url, status, req.method),
      };
    }),
  );
};

function createType(url, status, method) {
  return `${url.pathname.substring(1)} ${status}`;
}

export default function createHttp({
  defaults,
  createActionType = createType,
}) {
  const http = new Http(defaults);

  http.use(uses.actions);
  http.use(renameActions(createActionType));
  // http.use(logResponse);

  return http;
}
