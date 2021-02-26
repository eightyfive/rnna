import { filter, switchMap, take } from 'rxjs/operators';

import { BOOT } from '../store';

export default function createOnBoot(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => type === BOOT),
      take(1),
      switchMap(({ payload: store }) => handler(store, state$.value, services)),
    );
}
