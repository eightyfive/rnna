import { filter, switchMap, take } from 'rxjs/operators';

import { PERSISTED } from '../store';

export default function createOnStore(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === PERSISTED),
      take(1),
      switchMap(({ payload: store }) => handler(store, state$.value, services)),
    );
}
