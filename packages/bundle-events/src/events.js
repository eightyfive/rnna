import { EMPTY, merge } from 'rxjs';

export default class Events {
  constructor(listeners) {
    this.listeners = Object.values(listeners);
  }

  dispatch(type, payload) {
    const actions = this.listeners
      .map(listener => {
        if (listener.listen(type)) {
          return listener.handle(payload) || false;
        }

        return false;
      })
      .filter(Boolean);

    if (actions.length) {
      return merge(...actions);
    }

    return EMPTY;
  }
}
