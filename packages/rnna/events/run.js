import { filter, switchMap, take } from 'rxjs/operators';
import { REHYDRATE } from 'redux-persist';

export default function createOnRun(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === REHYDRATE),
      take(1),
      switchMap(() => handler(state$.value, services)),
    );
}
