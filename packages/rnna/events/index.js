import { EMPTY, of } from 'rxjs';
import { filter, map, mapTo, mergeMap, startWith } from 'rxjs/operators';

export { default as onAppState } from './app-state';
export { default as onBoot } from './boot';
export { default as onRegister } from './register';

export function onAction(type, handler) {
  const types = typeof type === 'string' ? [type] : type;

  return (action$, state$, services) =>
    action$.pipe(
      filter(({ type }) => types.includes(type)),
      mergeMap(({ payload, meta }) => {
        const res = handler(services, payload, meta);

        if (res === undefined) {
          return EMPTY;
        }

        return res;
      }),
    );
}

export const ofAction = (type, payload, meta) => of({ type, payload, meta });

export const mapAction = (mapType, mapPayload, mapMeta) => source =>
  source.pipe(
    map(action => {
      let data;

      if (action) {
        data = action.payload || action;
      }

      const type = typeof mapType === 'function' ? mapType(data) : mapType;

      const payload = mapPayload ? mapPayload(data) : undefined;

      const meta = mapMeta ? mapMeta(data) : undefined;

      return {
        type,
        payload,
        meta,
      };
    }),
  );

export const mapToAction = (type, payload, meta) => source =>
  source.pipe(
    mapTo({
      type,
      payload,
      meta,
    }),
  );

export const startWithAction = (type, payload, meta) => source =>
  source.pipe(
    startWith({
      type,
      payload,
      meta,
    }),
  );
