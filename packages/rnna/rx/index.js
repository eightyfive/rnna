import { of } from 'rxjs';
import { ignoreElements, map, switchMap, tap } from 'rxjs/operators';

import { isType } from './operators';

// RxJS
export const ofAction = (type, payload) => of({ type, payload });

export function execOn(...types) {
  const handler = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      isType(...types),
      tap(({ type, ...rest }) => {
        handler(rest.payload || rest, state$.value, services);
      }),
      ignoreElements(),
    );
  };
}

export function mapOn(...types) {
  const handler = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      isType(...types),
      map(({ type, ...rest }) =>
        handler(rest.payload || rest, state$.value, services),
      ),
    );
  };
}

export function switchOn(...types) {
  const handler = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      isType(...types),
      switchMap(({ type, ...rest }) =>
        handler(rest.payload || rest, state$.value, services),
      ),
    );
  };
}
