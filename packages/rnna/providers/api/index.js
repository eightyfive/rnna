import produce from 'immer';
import { createSelector } from 'reselect';
import Http from '@rnna/http';
import * as uses from '@rnna/http/use';

import Provider from '../provider';

class ApiProvider extends Provider {
  constructor(url, options) {
    super();

    this.http = new Http(url, options);
  }

  register(services, reducers, epics) {
    this.http.use(uses.error);
    this.http.use(uses.actions);

    Object.assign(services, { api: this.http });

    Object.assign(reducers, { api: createReducer() });

    Object.assign(services.db, {
      fetching,
      creating,
      reading,
      updating,
      deleting,
    });
  }
}

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
  return produce((draft, { type, meta: { req, res } }) => {
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

const fetching = createSelector(state => state.http.fetching, hasPaths);

const creating = createSelector(state => state.http.creating, hasPaths);

const reading = createSelector(state => state.http.reading, hasPaths);

const updating = createSelector(state => state.http.updating, hasPaths);

const deleting = createSelector(state => state.http.deleting, hasPaths);

export default function createApi({ url, options }) {
  return new ApiProvider(url, options);
}
