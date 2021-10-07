import { EMPTY, merge } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

export default function createOnRegister(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      take(1),
      switchMap(() => {
        const res = handler(services);

        if (Array.isArray(res)) {
          return res.length ? merge(...res) : EMPTY;
        }

        if (res === undefined) {
          return EMPTY;
        }

        return res;
      }),
    );
}
