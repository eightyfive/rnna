import { from } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';

const { group, groupCollapsed, groupEnd, log } = console;

const logRed = (err, logger = log) => logger(`%c${err}`, 'color: red');
const groupRed = err => logRed(err, group);

const logger = next => req$ =>
  next(req$).pipe(
    switchMap(([res, req]) =>
      from(res.clone().json()).pipe(
        tap(data => {
          const isError = res.status >= 300;
          const isException = isError && data && data.trace;

          if (isError) {
            groupRed(`${req.method} ${req.url} ${res.status}`);
          } else {
            groupCollapsed(req.method, req.url, res.status);
          }

          logReq(req);

          if (isException) {
            logRes(res);
          } else {
            logRes(res, data);
          }

          if (isException) {
            logException(data);
          }

          groupEnd();
        }),
        mapTo([res, req]),
      ),
    ),
  );

export default logger;

function logHeaders(headers) {
  groupCollapsed('Headers');
  for (let [name, value] of headers.entries()) {
    log(`${name}: ${value}`);
  }
  groupEnd();
}

function logReq(req) {
  groupCollapsed('Request');
  log(req.method);
  log(req.url);
  logHeaders(req.headers);
  log('credentials', req.credentials);
  log('mode', req.mode);
  groupEnd();
}

function logRes(res, data) {
  group('Response');
  log(res.statusText, res.status);
  if (data) {
    log(data);
  }
  logHeaders(res.headers);
  groupEnd();
}

function logException(data) {
  groupRed('Exception');

  logRed(data.message);

  if (data.exception) {
    log(data.exception);
  }

  if (data.file) {
    log(`${data.file} (${data.line})`);
  }

  if (data.trace) {
    log(data.trace);
  }

  groupEnd();
}
