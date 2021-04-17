import { AppState } from 'react-native';
import { EMPTY, fromEvent } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';

export default function createOnAppState(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      take(1),
      switchMap(() =>
        fromEvent(AppState, 'change').pipe(
          mergeMap(name => {
            const res = handler(name, state$.value, services);

            if (res === undefined) {
              return EMPTY;
            }

            return res;
          }),
        ),
      ),
    );
}
