import { from, merge } from 'rxjs';
import { skip, take, mapTo, switchMap, tap } from 'rxjs/operators';

const logRed = (err, logger = log) => logger(`%c${err}`, 'color: red');
const groupRed = err => logRed(err, console.group);

const logger = next => req => {
  const rr$ = next(req);

  // Req
  const req$ = rr$.pipe(
    take(1),
    tap(req => {
      console.groupCollapsed(req.method, req.url, 202);

      console.log(req.method);
      console.log(req.url);
      logHeaders(req.headers);
      console.log('credentials', req.credentials);
      console.log('mode', req.mode);

      console.groupEnd();
    }),
  );

  // Res
  const res$ = rr$.pipe(
    skip(1),
    switchMap(res => {
      return from(res.clone().json()).pipe(
        tap(data => {
          if (res.status >= 300) {
            groupRed(`${req.method} ${req.url} ${res.status}`);
          } else {
            console.groupCollapsed(req.method, req.url, res.status);
          }

          console.log(res.statusText, res.status);
          console.log(data);
          logHeaders(res.headers);

          console.groupEnd();
        }),
      );
    }),
    mapTo(res$),
  );

  return merge(req$, res$);
};

export default logger;

function logHeaders(headers) {
  console.groupCollapsed('Headers');

  for (let [name, value] of headers.entries()) {
    console.log(`${name}: ${value}`);
  }
  console.groupEnd();
}
