import { switchMap, take } from 'rxjs/operators';

export default function createOnBoot(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      take(1),
      switchMap(() => handler(state$.value, services)),
    );
}
