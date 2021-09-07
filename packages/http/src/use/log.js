import { filter, tap } from 'rxjs/operators';

import parse from 'console.unicorn/parser';

const log = next => req$ => {
  return next(req$).pipe(
    filter(({ responseType: type }) => type === 'json'),
    tap(({ request: req, response: res, status }) => {
      console.groupCollapsed(
        ...parse(`{grey}${req.method} {white}${req.url} {grey}${status}`),
      );
      if (req.body) {
        console.log(JSON.parse(req.body));
      }
      console.log(res);
      console.groupEnd();
    }),
  );
};

export default log;
