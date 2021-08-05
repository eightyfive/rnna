import { EMPTY } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

export { default as onAppState } from './app-state';
export { default as onBoot } from './boot';
export { default as onRegister } from './register';

export function onAction(type, handler) {
  const types = typeof type === 'string' ? [type] : type;

  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => types.includes(type)),
      mergeMap(({ payload }) => {
        const res = handler(payload, services);

        if (res === undefined) {
          return EMPTY;
        }

        return res;
      }),
    );
}
