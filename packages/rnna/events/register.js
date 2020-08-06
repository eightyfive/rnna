import { switchMap, take } from 'rxjs/operators';

export default function createOnRegister(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      take(1),
      switchMap(() => handler(services)),
    );
}
