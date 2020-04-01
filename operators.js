import { from, of } from 'rxjs';
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

// Api
export const createMapApi = mapType => makeRequest => source =>
  source.pipe(
    switchMap(action => {
      const payload = action.payload || action;
      const res$ = makeRequest(payload);

      return res$.pipe(
        filter(
          ([res, req]) =>
            res.headers.get('Content-Type') === 'application/json',
        ),
        mapApiResponse(mapType),
        catchApiError(mapType),
      );
    }),
  );

const mapApiResponse = mapType => source =>
  source.pipe(
    switchMap(([res, req]) =>
      from(
        res.json().then(json => ({
          type: mapType(req.method, req.url, res.status),
          payload: json.data || json,
        })),
      ).pipe(startWithAction(mapType(req.method, req.url, 202))),
    ),
  );

const catchApiError = mapType => source =>
  source.pipe(
    catchError(err =>
      of(err).pipe(
        filter(err => err.response),
        switchMap(err =>
          from(
            err.response.json().then(data => {
              const req = err.request;
              const res = err.response;

              err.data = data;

              return {
                type: mapType(req.method, req.url, res.status),
                error: true,
                payload: err,
              };
            }),
          ),
        ),
      ),
    ),
  );
