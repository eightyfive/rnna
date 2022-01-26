import { EMPTY, merge } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

export default function createOnBoot(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === 'app/boot'),
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
