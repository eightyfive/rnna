import { combineEpics } from 'redux-observable';

import { Lo } from '../services';

import * as navigation from './navigation';

const epics = Lo.concatValues(navigation);

export default combineEpics(...epics);
