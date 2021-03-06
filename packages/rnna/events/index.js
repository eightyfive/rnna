import { EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export { default as onAppState } from './app-state';
export { default as onBoot } from './boot';
export { default as onRegister } from './register';

export function onAction(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      mergeMap(action => {
        const res = handler(action, services);

        if (res === undefined) {
          return EMPTY;
        }

        return res;
      }),
    );
}
