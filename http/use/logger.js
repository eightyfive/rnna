import { from } from 'rxjs/observable/from';
import { mapTo } from 'rxjs/operators/mapTo';
import { switchMap } from 'rxjs/operators/switchMap';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { tap } from 'rxjs/operators/tap';

const logger = next => req$ =>
  next(req$).pipe(
    withLatestFrom(req$),
    switchMap(([res, req]) =>
      from(res.clone().json()).pipe(
        tap(data => {
          console.groupCollapsed(req.url);
          console.log(req);
          console.log(res);
          console.log(data);
          console.groupEnd();

          if (res.status >= 300) {
            console.group(`Server Error (${res.status}): ${data.message}`);

            if (data.exception) {
              console.log(data.exception);
            }

            if (data.file) {
              console.log(`${data.file} (${data.line})`);
            }

            if (data.trace) {
              console.log(data.trace);
            }

            console.groupEnd();
          }
        }),
        mapTo(res),
      ),
    ),
  );

export default logger;
