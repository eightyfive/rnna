import Events from './Events';

export default /** abstract */ class Router {
  constructor(layouts, config = {}) {
    this.defined = new Map();
    this.layouts = new Map(Object.entries(layouts));
    this.config = config;
    this.order = Array.from(this.layouts.keys());
    this.listeners = {};
    this.history = [];

    this.layouts.forEach((layout, name) => {
      this.defineProperty(name, layout);
    });
  }

  defineProperty(name, value) {
    if (this.defined.has(name)) {
      throw new Error(`${name} is already defined`);
    }

    this.defined.set(name, true);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
    Object.defineProperty(this, name, { enumerable: true, value });
  }

  addListener(eventName, listener) {
    const subscription = Events.addListener(eventName, listener);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(subscription);

    return subscription;
  }

  removeListener(eventName, listener) {
    const subscription = this.listeners[eventName].find(cb => cb === listener);

    if (subscription) {
      Events.removeListener(subscription);

      this.listeners[eventName] = this.listeners[eventName].filter(
        cb => cb !== listener,
      );
    }
  }

  get name() {
    return Array.from(this.history).pop();
  }

  render(path, props) {
    throwAbstract('render(path, props)');
  }

  goBack() {
    throwAbstract('goBack()');
  }

  readPath(path) {
    const [name, ...childPath] = path.split('/');

    return [name, childPath.length ? childPath.join('/') : null];
  }

  renderBottomTabs(bottomTabs, childName, props) {
    const [stackName, componentName] = this.readPath(childName);

    if (bottomTabs.stackName !== stackName) {
      bottomTabs.selectTab(stackName);
    }

    this.renderStack(bottomTabs[stackName], componentName, props);
  }

  renderStack(stack, componentName, props) {
    const index = stack.history.findIndex(name => name === componentName);

    if (stack.componentName === componentName) {
      // Update current component
      stack[componentName].update(props);
    } else if (index === -1) {
      // Push new screen
      stack.push(componentName, props);
    } else {
      // Pop to previous screen
      stack.popToIndex(index);
    }
  }

  goBackBottomTabs(bottomTabs) {
    // TODO ?
  }

  goBackStack(stack) {
    stack.pop();
  }
}

function throwAbstract(method) {
  throw new Error(`Abstract: Implement Router.${method}`);
}
