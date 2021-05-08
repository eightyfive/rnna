import { Component, BottomTabs, Modal, Overlay, Stack } from './Layouts';
import Router from './Router';

export default class SwitchRouter extends Router {
  constructor(layouts, config = {}) {
    super(layouts, config);

    const notAllowed = Array.from(this.layouts.values()).some(
      layout => layout instanceof Modal || layout instanceof Overlay,
    );

    if (notAllowed.length) {
      throw new TypeError('Invalid argument', 'SwitchRouter.js', 5);
    }
  }

  render(componentId, props) {
    const [name, path] = this.readPath(componentId);

    let layout;

    if (this.name !== name) {
      // Unmount old layout
      layout = this.layouts.get(this.name);

      if (layout) {
        layout.unmount();
      }

      // TODO: SwitchRouter.history (??)
      this.name = name;

      // Mount new layout
      layout = this.layouts.get(this.name);
      layout.mount(props);
    } else if (layout instanceof Component) {
      layout.render(props);
    }

    if (layout instanceof BottomTabs) {
      this.renderBottomTabs(layout, path, props);
    }

    if (layout instanceof Stack) {
      this.renderStack(layout, path, props);
    }
  }

  renderBottomTabs(bottomTabs, path, props) {
    const [stackName, componentName] = this.readPath(path);

    if (bottomTabs.stackName !== stackName) {
      bottomTabs.selectTab(name);
    }

    bottomTabs[stackName][componentName].update(props);
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

  goBack() {
    const layout = this.layouts.get(this.name);

    if (layout instanceof BottomTabs) {
      this.goBackBottomTabs(layout);
    }

    if (layout instanceof Stack) {
      this.goBackStack(layout);
    }
  }

  goBackBottomTabs(bottomTabs) {
    // TODO ?
  }

  goBackStack(stack) {
    stack.pop();
  }
}
