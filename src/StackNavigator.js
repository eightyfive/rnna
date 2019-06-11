import Navigator from "./Navigator";

export default class StackNavigator extends Navigator {
  constructor(navigation, stack, config = {}) {
    super();

    this.navigation = navigation;
    this.name = config.name;
    this.stack = stack;
    this.order = config.order || this.stack.getOrder();
    this.initialComponentId = config.initialRouteName || this.order[0];

    this.history = [this.initialComponentId];

    const events = this.navigation.events();

    this.didDisappearListener = events.registerComponentDidDisappearListener(
      this.handleDidDisappear
    );
  }

  handleDidDisappear = ({ componentId }) => {
    if (componentId === this.getActiveId()) {
      // FIXME: Hacky
      // Native back button has been pressed
      this.history.pop();
    }
  };

  getActiveId() {
    return this.history[this.history.length - 1];
  }

  mount() {
    this.navigation.setRoot({ root: this.getInitialLayout() });
  }

  getInitialLayout() {
    return this.stack.getLayout(this.initialComponentId);
  }

  navigate(toId, params, fromId) {
    const index = this.history.findIndex(componentId => componentId === toId);

    if (index !== -1) {
      this.popToIndex(index);
    } else {
      this.push(toId, params, fromId);
    }
  }

  goBack(fromId) {
    const componentId = this.getActiveId();

    if (fromId !== componentId) {
      throw new Error(`goBack from mismatch: ${fromId} != ${componentId}`);
    }

    if (this.history.length === 1) {
      throw new Error("No route to go back to");
    }

    this.navigation.pop(fromId);
    this.history.pop();
  }

  push(toId, params, fromId) {
    const component = this.stack.getChild(toId);

    if (!component) {
      throw new Error(`Unknown stack child: ${toId}`);
    }

    this.navigation.push(fromId, component.getLayout(params));
    this.history.push(toId);
  }

  pop(n = 1) {
    const index = this.history.length - 1 - n;

    if (index < 0) {
      throw new Error(`Out of range popTo: ${n}`);
    }

    this.popToIndex(index);
  }

  popToIndex(index) {
    this.history.splice(index + 1);

    const componentId = this.history[index];

    this.navigation.popTo(componentId);
  }

  popToTop(fromId) {
    this.navigation.popToRoot(fromId);
  }

  // eslint-disable-next-line class-methods-use-this
  dismiss() {
    throw new Error("'modal' mode not supported, use `ModalNavigator` instead");
  }
}
