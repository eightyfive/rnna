import produce from 'immer';

const initialState = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
  //
  creating: [],
  reading: [],
  updating: [],
  deleting: [],
};

export default function createReducer() {
  return produce((draft, { error = false, meta = {} }) => {
    const { req, res, url } = meta;

    if (error || (req && res)) {
      // Response
      draft[req.method][url.pathname] = (res || {}).status || 500;

      // C
      if (req.method === 'POST') {
        draft.creating = draft.creating.filter(path => path !== url.pathname);
      }

      // R
      if (req.method === 'GET') {
        draft.reading = draft.reading.filter(path => path !== url.pathname);
      }

      // U
      if (req.method === 'PUT') {
        draft.updating = draft.updating.filter(path => path !== url.pathname);
      }

      // D
      if (req.method === 'DELETE') {
        draft.deleting = draft.deleting.filter(path => path !== url.pathname);
      }
    } else if (req) {
      // Request
      draft[req.method][url.pathname] = 202;

      // C
      if (req.method === 'POST') {
        draft.creating.push(url.pathname);
      }

      // R
      if (req.method === 'GET') {
        draft.reading.push(url.pathname);
      }

      // U
      if (req.method === 'PUT') {
        draft.updating.push(url.pathname);
      }

      // D
      if (req.method === 'DELETE') {
        draft.deleting.push(url.pathname);
      }
    }
  }, initialState);
}
