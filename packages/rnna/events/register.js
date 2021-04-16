import { empty } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

export default function createOnRegister(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      take(1),
      switchMap(() => {
        const res = handler(services);

        if (res === undefined) {
          return empty();
        }

        return res;
      }),
    );
}
