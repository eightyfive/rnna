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
        err.response.status === status,
    ),
  );

export const takeUntilType = (action$, type) => source =>
  source.pipe(takeUntil(action$.pipe(ofType(type))));

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
      ).pipe(startWithAction(createType(req.method, req.url, 202))),
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
