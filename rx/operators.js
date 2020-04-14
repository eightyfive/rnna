import {
  catchError,
  filter,
  ignoreElements,
  map,
  mapTo,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import HTTPError from 'fetch-run/http-error';

export const exec = cb => source =>
  source.pipe(
    tap(action => cb(action)),
    ignoreElements(),
  );

// Accepts regular expressions
export const ofReType = (...expressions) => source =>
  source.pipe(
    filter(({ type }) =>
      expressions.some(re =>
        typeof re === 'string' ? type === re : re.test(type),
      ),
    ),
  );

// Alias
export const ofType = ofReType;

export const ofHTTPErrorType = status => source =>
  source.pipe(
    filter(
      ({ error, payload: err }) =>
        error === true &&
        err instanceof HTTPError &&
        (status ? err.response.status === status : true),
    ),
  );

export const takeUntilType = (action$, type) => source =>
  source.pipe(takeUntil(action$.pipe(ofType(type))));

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

// Log
const colors = {
  white: '#ffffff',
  blue: '#4252db',
  red: '#db4d52',
};

export function createLog({ dark = true, color, prefix = '[DEBUG]' }) {
  let col;

  if (color) {
    col = color;
  } else {
    col = dark ? colors.white : colors.blue;
  }

  return label => source =>
    source.pipe(
      filter(() => __DEV__), // Safety
      tap(data => {
        let type;
        let payload;

        const isObj =
          data !== null && !Array.isArray(data) && typeof data === 'object';

        if (isObj) {
          let rest;

          ({ type, ...rest } = data);

          payload = rest.hasOwnProperty('payload') ? rest.payload : rest;
        } else {
          payload = data;
        }

        let title;

        if (label) {
          title = `%c${prefix} ${label}`;
        } else {
          title = `%c${prefix}`;
        }

        console.group(title, `color: ${col};`);

        if (type) {
          console.log(`%c${type}`, `color: ${colors.red};`);
        }
        console.log(payload);

        console.groupEnd();
      }),
    );
}

// Actions
export const mapAction = (mapType, mapPayload) => source =>
  source.pipe(
    map(data => {
      let type;
      let payload = data.payload || data;

      if (typeof mapType === 'function') {
        type = mapType(payload);
      } else {
        type = mapType;
      }

      if (typeof mapPayload === 'undefined') {
        return { type };
      }

      if (typeof mapPayload === 'function') {
        payload = mapPayload(payload);
      } else {
        payload = mapPayload;
      }

      return { type, payload };
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
