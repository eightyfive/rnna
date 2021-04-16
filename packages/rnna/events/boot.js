import { empty } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { REHYDRATE } from 'redux-persist';

export default function createOnBoot(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === REHYDRATE),
      take(1),
      switchMap(() => {
        const res = handler(state$.value, services);

        if (res === undefined) {
          return empty();
        }

        return res;
      }),
    );
}
