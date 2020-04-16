import { from } from 'rxjs';
import { mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';

const logRed = (err, logger = log) => logger;
const groupRed = err => logRed(err, console.group);

const logger = next => req$ => {
  return next(req$).pipe(
    withLatestFrom(req$),
    switchMap(([res, req]) => {
      return from(res.clone().json()).pipe(
        tap(data => {
          if (res.status >= 300) {
            console.group(
              `%c${[req.method, req.url, res.status].join(' ')}`,
              'color: red',
            );
          } else {
            console.groupCollapsed(req.method, req.url, res.status);
          }

          // Request
          console.groupCollapsed('Request');

          console.log(req.method);
          console.log(req.url);
          logHeaders(req.headers);
          console.log('credentials', req.credentials);
          console.log('mode', req.mode);

          console.groupEnd();

          // Response
          console.groupCollapsed('Response');

          console.log(res.statusText, res.status);
          console.log(data);
          logHeaders(res.headers);

          console.groupEnd();

          console.groupEnd();
        }),
        mapTo(res),
      );
    }),
  );
};

export default logger;

function logHeaders(headers) {
  console.groupCollapsed('Headers');

  for (let [name, value] of headers.entries()) {
    console.log(`${name}: ${value}`);
  }
  console.groupEnd();
}
