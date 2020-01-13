import Component from './Component';

export default class Stack {
  constructor(children, options) {
    this.children = children;
    this.options = options;

    const invalid = children.some(child => !(child instanceof Component));

    if (invalid) {
      throw new Error('Stack: All children must be `Component`');
    }
  }

  getLayout(componentId = null) {
    let { children } = this;

    if (componentId) {
      const index = this.getOrder().findIndex(id => id === componentId);

      if (index === -1) {
        throw new Error(`Stack: Unknown child component: ${componentId}`);
      }

      children = children.slice(0, index + 1);
    }

    const layout = {
      children: children.map(child => child.getLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  getChild(componentId) {
    return this.children.find(component => component.id === componentId);
  }

  getOrder() {
    return this.children.map(component => component.id);
  }
}
