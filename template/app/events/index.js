import { combineEpics } from 'redux-observable';

import { Lo } from '../services';

import * as api from './api';
import * as navigation from './navigation';
import * as services from './services';

const epics = Lo.concatValues(services, api, navigation);

export default combineEpics(...epics);
