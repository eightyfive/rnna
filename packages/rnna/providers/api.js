import { createSelector } from 'reselect';
import parseUrl from 'url-parse';
import { from, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import Http from '@rnna/http';
import * as uses from '@rnna/http/use';

class ApiProvider extends Provider {
  constructor(url, options) {
    this.http = new Http(url, options);
  }

  register(services, reducers, epics) {
    // Error middleware to throw HTTP errors (>= 400)
    this.http.use(uses.error);

    // Emits req, res & err actions
    this.http.use(emitActions);

    Object.assign(services, { api: this.http });

    Object.assign(reducers, { http: createReducer() });

    services.db.fetching = selectFetching();
    services.db.creating = selectCreating();
    services.db.reading = selectReading();
    services.db.updating = selectUpdating();
    services.db.deleting = selectDeleting();
  }
}

const emitActions = next => req$ => {
  const res$ = next(req$);

  const reqAction$ = req$.pipe(
    map(req => {
      const { pathname } = parseUrl(req.url);

      // Req action
      return {
        type: pathname.substring(1),
        meta: {
          req,
          res: null,
        },
      };
    }),
  );

  const resAction$ = res$.pipe(
    filter(res => res.headers.get('Content-Type') === 'application/json'),
    withLatestFrom(req$),

    // Res action
    switchMap(([res, req]) =>
      from(res.json()).pipe(
        map(json => {
          const { pathname } = parseUrl(req.url);

          return {
            type: pathname.substring(1),
            payload: json.data || json,
            meta: {
              req,
              res,
            },
          };
        }),
      ),
    ),

    // Error action
    catchError(err =>
      of(err).pipe(
        filter(err => {
          if (err.response) {
            return true;
          }

          // Re-throw if not HTTP error
          throw err;
        }),
        switchMap(err =>
          from(err.response.json()).pipe(
            map(json => {
              const req = err.request;
              const res = err.response;

              const { pathname } = parseUrl(req.url);

              err.data = json.data || json;

              return {
                type: pathname.substring(1),
                payload: err,
                error: true,
                meta: {
                  req,
                  res,
                },
              };
            }),
          ),
        ),
      ),
    ),
  );

  return merge(reqAction$, resAction$);
};

// Resource reducer
const initialState = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
  //
  fetching: [],
  creating: [],
  reading: [],
  updating: [],
  deleting: [],
};

function createReducer() {
  return produce((draft, { type, payload = {}, meta = {} }) => {
    const { req, res } = meta;

    // Request
    if (req && !res) {
      draft[req.method][type] = 202;

      draft.fetching.push(type);

      // C
      if (req.method === 'POST') {
        draft.creating.push(type);
      }

      // R
      if (req.method === 'GET') {
        draft.reading.push(type);
      }

      // U
      if (req.method === 'PUT') {
        draft.updating.push(type);
      }

      // D
      if (req.method === 'DELETE') {
        draft.deleting.push(type);
      }
    }

    // Response
    if (req && res) {
      draft[req.method][type] = res.status;

      draft.fetching = draft.fetching.filter(path => path !== type);

      // C
      if (req.method === 'POST') {
        draft.creating = draft.creating.filter(path => path !== type);
      }

      // R
      if (req.method === 'GET') {
        draft.reading = draft.reading.filter(path => path !== type);
      }

      // U
      if (req.method === 'PUT') {
        draft.updating = draft.updating.filter(path => path !== type);
      }

      // D
      if (req.method === 'DELETE') {
        draft.deleting = draft.deleting.filter(path => path !== type);
      }
    }
  }, initialState);
}

// Selectors
const hasPaths = paths => paths.length > 0;

const selectFetching = createSelector(({ http }) => http.fetching, hasPaths);

const selectCreating = createSelector(({ http }) => http.creating, hasPaths);

const selectReading = createSelector(({ http }) => http.reading, hasPaths);

const selectUpdating = createSelector(({ http }) => http.updating, hasPaths);

const selectDeleting = createSelector(({ http }) => http.deleting, hasPaths);

export default function createApi({ url, options }) {
  return new ApiProvider(url, options);
}
