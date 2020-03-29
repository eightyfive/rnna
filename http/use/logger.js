import { from } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';

const logger = next => req$ =>
  next(req$).pipe(
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
        mapTo([res, req]),
      ),
    ),
  );

export default logger;
