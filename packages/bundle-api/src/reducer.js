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

    let paths;

    if (error || (req && res)) {
      // Response
      draft[req.method][url.pathname] = (res || {}).status || 500;

      // C
      if (req.method === 'POST') {
        paths = draft.creating;
      }

      // R
      if (req.method === 'GET') {
        paths = draft.reading;
      }

      // U
      if (req.method === 'PUT') {
        paths = draft.updating;
      }

      // D
      if (req.method === 'DELETE') {
        paths = draft.deleting;
      }

      const index = paths.indexOf(url.pathname);

      if (index !== -1) {
        paths.splice(index, 1);
      }
    } else if (req) {
      // Request
      draft[req.method][url.pathname] = 202;

      // C
      if (req.method === 'POST') {
        paths = draft.creating;
      }

      // R
      if (req.method === 'GET') {
        paths = draft.reading;
      }

      // U
      if (req.method === 'PUT') {
        paths = draft.updating;
      }

      // D
      if (req.method === 'DELETE') {
        paths = draft.deleting;
      }

      paths.push(url.pathname);
    }
  }, initialState);
}
