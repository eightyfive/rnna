import { from } from 'rxjs';
import { mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import groups from 'console.groups';

const logger = next => req$ => {
  return next(req$).pipe(
    withLatestFrom(req$),
    switchMap(([res, req]) => {
      return from(res.clone().json()).pipe(
        tap(data => {
          let title = [req.method, req.url, req.status].join(' ');

          // if Error
          if (res.status >= 300) {
            title = `{red}${title}`;
          }

          groups(
            {
              [title]: {
                Request: {
                  '0': req.method,
                  '1': req.url,
                  Headers: mapHeaders(req.headers),
                  '2': `credentials: ${req.credentials}`,
                  '3': `mode: ${req.mode}`,
                },
                Response: {
                  '0': [res.statusText, res.status],
                  '1': data,
                  Headers: mapHeaders(res.headers),
                },
              },
            },
            [res.status < 300],
          );
        }),
        mapTo(res),
      );
    }),
  );
};

export default logger;

function mapHeaders(headers) {
  const values = [];

  for (let [name, value] of headers.entries()) {
    values.push(`${name}: ${value}`);
  }

  return values;
}
