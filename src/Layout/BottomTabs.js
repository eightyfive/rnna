import Component from './Component';
import Stack from './Stack';

export default class BottomTabs {
  constructor(id, children, options) {
    this.id = id;
    this.name = id;
    this.children = children;
    this.options = options;

    const invalid = children.some(
      child => !(child instanceof Stack) && !(child instanceof Component),
    );

    if (invalid) {
      throw new Error(
        'BottomTabs: All children must be either `Stack` or `Component`',
      );
    }
  }

  getTab(tabId) {
    return this.children.find(component => component.id === tabId);
  }

  getLayout() {
    const layout = {
      id: this.id,
      name: this.name,
      children: this.children.map(child => child.getLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  getOrder() {
    return this.children.map(component => component.id);
  }
}
