import { filter, switchMap, take } from 'rxjs/operators';

import { START } from '../store';

export default function createOnStart(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === START),
      take(1),
      switchMap(() => handler(state$.value, services)),
    );
}
