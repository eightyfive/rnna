import { of } from 'rxjs';

import { isHTTPErrorType, isType } from './operators';

export const ofAction = (type, payload) => of({ type, payload });

export function on(...types) {
  const handler = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      isType(...types),
      handler(action.payload || action, state$.value, services),
    );
  };
}

export function onHTTP(code, handler) {
  return (action$, state$, services) =>
    action$.pipe(
      isHTTPErrorType(code),
      handler(action.payload || action, state$.value, services),
    );
}
