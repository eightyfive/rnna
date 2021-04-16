import { empty } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export { default as onAppState } from './app-state';
export { default as onBoot } from './boot';
export { default as onRegister } from './register';
export { default as router } from './router';

export function onAction(handler) {
  return (action$, state$, services) =>
    action$.pipe(
      mergeMap(action => {
        const res = handler(action, state$.value, services);

        if (res === undefined) {
          return empty();
        }

        return res;
      }),
    );
}
