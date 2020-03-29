import { createResultSelector as result } from 'rnna/selectors';

export default {
  getUser: result('db.users', 'session.userId'),
};
