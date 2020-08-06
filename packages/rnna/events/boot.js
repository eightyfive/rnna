import { switchMap, take } from 'rxjs/operators';

export default function createOnBoot(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === '[App] Boot'),
      take(1),
      switchMap(() => handler(state$.value, services)),
    );
}
