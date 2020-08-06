import { empty, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofHTTPErrorType, ofType } from '@rnna/rx/operators';

export function on(...types) {
  const callback = types.pop();

  return (action$, state$, services) => {
    return action$.pipe(
      ofType(...types),
      switchMap(action => {
        const result = callback(
          action.payload || action,
          state$.value,
          services,
        );

        return mapResult(result);
      }),
    );
  };
}

export const mapApi = callback => source =>
  source.pipe(
    switchMap(action =>
      fromApi(callback(action ? action.payload || action : undefined)),
    ),
  );

export function onHTTPErrorType(code, callback) {
  return (action$, state$, services) =>
    action$.pipe(
      ofHTTPErrorType(code),
      switchMap(action => {
        const result = callback(action, state$.value, services);

        return mapResult(result);
      }),
    );
}

export function mapResult(result) {
  if (typeof result === 'undefined') {
    return empty();
  }

  if (typeof result === 'string') {
    return of({ type: result });
  }

  if (Array.isArray(result)) {
    const [type, payload] = result;

    return of({ type, payload });
  }

  // Observable
  return result;
}
