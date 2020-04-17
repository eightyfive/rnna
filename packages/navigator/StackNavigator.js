import _last from 'lodash.last';
import _take from 'lodash.take';

import { StackNavigator as Wix } from './wix';

export default class StackNavigator extends Wix {
  constructor(routes, options = {}, config = {}) {
    super(routes, options, config);

    // TODO
    // https://reactnavigation.org/docs/stack-navigator#props
    // this.initialRouteName =
    // this.screenOptions =
    // this.keyboardHandlingEnabled =
    // this.mode =
    // this.headerMode =
  }

  navigate(toName, params, fromId) {
    const index = this.history.findIndex(name => name === toName);

    if (index === -1) {
      this.push(toName, params, fromId);
    } else if (index >= 1) {
      this.popToIndex(index);
    }
  }

  goBack() {
    if (this.history.length === 1) {
      throw new Error('No route to navigate back to');
    }

    this.history.pop();
    this.pop();
  }

  pop(n = 1) {
    const index = this.history.length - 1 - n;

    if (index < 0) {
      throw new Error(`Out of range popTo: ${n}`);
    }

    // popToIndex
    this.history = _take(this.history, index + 1);

    const toName = _last(this.history);
    const toId = this.componentIds.get(toName);

    this.popTo(toId);
  }

  popToTop() {
    this.popToRoot();
  }
}
