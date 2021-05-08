import Emitter from './Emitter';

export default /** abstract */ class Navigator extends Emitter {
  constructor(layouts, config = {}) {
    super();

    this.layouts = new Map(Object.entries(layouts));
    this.config = config;
    this.order = Array.from(this.layouts.keys());

    this.layouts.forEach((layout, name) => {
      this.defineProperty(name, layout);
    });
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
  throw new Error(`Abstract: Implement Navigator.${method}`);
}
