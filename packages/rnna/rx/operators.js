import _get from 'lodash.get';
import { EMPTY } from 'rxjs';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  mapTo,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';

export const exec = handler => source =>
  source.pipe(
    tap(action => handler(action)),
    ignoreElements(),
  );

// Accepts regular expressions
export const isReType = (...expressions) => source =>
  source.pipe(
    filter(({ type }) =>
      expressions.some(re => {
        if (typeof re === 'string') {
          return type === re || new RegExp(re).test(type);
        }

        return re.test(type);
      }),
    ),
  );

// Alias
export const isType = isReType;

export const takeUntilType = (action$, type) => source =>
  source.pipe(takeUntil(action$.pipe(isType(type))));

export const pluck = (...paths) => source =>
  source.pipe(
    map(data => {
      const payload = data.payload || data;
      const result = {};

      for (const key of paths) {
        let [path, name] = key.split(':').map(str => str.trim());

        if (!name) {
          name = path.split('.').pop();
        }

        result[name] = _get(payload, path);
      }

      if (paths.length === 1) {
        return o.values(result).pop();
      }

      return result;
    }),
  );

// Actions
export const mapAction = (mapType, mapPayload) => source =>
  source.pipe(
    map(action => {
      let data;

      if (action) {
        data = action.payload || action;
      } else {
        data = action;
      }

      const type = typeof mapType === 'function' ? mapType(data) : mapType;

      if (typeof mapPayload === 'function') {
        return {
          type,
          payload: mapPayload(data),
        };
      }

      return {
        type,
      };
    }),
  );

export const mapToAction = (type, payload) => source =>
  source.pipe(
    mapTo({
      type,
      payload,
    }),
  );

export const startWithAction = (type, payload) => source =>
  source.pipe(
    startWith({
      type,
      payload,
    }),
  );

export const catchIgnore = handler =>
  catchError(err => {
    if (handler) {
      handler(err);
    }

    return EMPTY;
  });
