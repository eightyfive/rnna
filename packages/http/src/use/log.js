import { catchError, filter, tap } from 'rxjs/operators';

import parse from 'console.unicorn/parser';

const log = next => req$ => {
  return next(req$).pipe(
    filter(({ responseType: type }) => type === 'json'),
    tap(res => {
      logGroup(res.request, res.response, res.status);
    }),
    catchError(err => {
      if (err.name === 'AjaxError') {
        logGroup(err.request, err.response, err.status, true);
      }

      throw err;
    }),
  );
};

export default log;

function logGroup(req, res, status, error = false) {
  const color = error ? 'red' : 'white';

  const label = parse(
    `{${color}}${req.method} {grey}${req.url} {${color}}${status}`,
  );

  console.groupCollapsed(...label);

  if (req.body) {
    console.log(JSON.parse(req.body));
  }

  console.log(res);
  console.groupEnd();
}
