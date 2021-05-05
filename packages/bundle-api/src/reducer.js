import parseUrl from 'url-parse';
import produce from 'immer';

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

export default function createReducer() {
  return produce((draft, { meta = {} }) => {
    const { req, res } = meta;

    if (req) {
      const { pathname } = parseUrl(req.url);

      if (res) {
        // Response
        draft[req.method][pathname] = res.status;

        draft.fetching = draft.fetching.filter(path => path !== pathname);

        // C
        if (req.method === 'POST') {
          draft.creating = draft.creating.filter(path => path !== pathname);
        }

        // R
        if (req.method === 'GET') {
          draft.reading = draft.reading.filter(path => path !== pathname);
        }

        // U
        if (req.method === 'PUT') {
          draft.updating = draft.updating.filter(path => path !== pathname);
        }

        // D
        if (req.method === 'DELETE') {
          draft.deleting = draft.deleting.filter(path => path !== pathname);
        }
      } else {
        // Request
        draft[req.method][pathname] = 202;

        draft.fetching.push(pathname);

        // C
        if (req.method === 'POST') {
          draft.creating.push(pathname);
        }

        // R
        if (req.method === 'GET') {
          draft.reading.push(pathname);
        }

        // U
        if (req.method === 'PUT') {
          draft.updating.push(pathname);
        }

        // D
        if (req.method === 'DELETE') {
          draft.deleting.push(pathname);
        }
      }
    }
  }, initialState);
}
