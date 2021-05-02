import { Bundle } from 'rnna';

import createReducer from './reducer';
import ResourceProvider from './provider';

export default class ResourceBundle extends Bundle {
  constructor(name) {
    super();

    this.name = name;
  }

  getServiceProvider() {
    return new ResourceProvider(this.name);
  }

  getReducers() {
    return { [this.name]: createReducer(this.name) };
  }

  getEpics() {
    return [];
  }
}
