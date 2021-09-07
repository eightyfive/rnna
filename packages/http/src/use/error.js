import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

const ajaxError = next => req$ => {
  return next(req$).pipe(
    catchError(err => {
      if (err.name === 'AjaxError') {
        return EMPTY;
      }

      throw err;
    }),
  );
};

export default ajaxError;
