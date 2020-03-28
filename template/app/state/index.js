import { combineReducers } from 'redux';

import db from './db';
import session from './session';

export default combineReducers({
  db,
  session,
});
