import {
  getSlice as slice,
  // createSelector as sel,
  createResultSelector as result,
} from 'rnna/selectors';

export default {
  getToken: slice('session.token'),
  getUser: result('db.users', 'session.userId'),
};
