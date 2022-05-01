import { Reducer, Store } from 'redux';
import { Epic } from 'redux-observable';
import { Container } from './container';

export abstract class Bundle<Services, Options = undefined> {
  options?: Options;

  constructor(options?: Options) {
    this.options = options;
  }

  abstract register(container: Container<{}>): void;

  abstract boot(services: Services, store: Store): void;

  getReducers(): Record<string, Reducer> {
    return {};
  }

  getEpics(): Epic[] {
    return [];
  }
}
