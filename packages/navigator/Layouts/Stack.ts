import { Component } from './Component';
import { Layout, LayoutType, Props } from './Layout';

type StackLayout = LayoutType;

type StackRoot = { stack: StackLayout };

export class Stack extends Layout<StackRoot> {
  static layoutIndex = 0;

  components: Map<string, Component>;
  id: string;
  order: string[];
  initialName: string;

  constructor(components: Record<string, Component>, config = {}) {
    super(config);

    this.components = new Map(Object.entries(components));
    this.id = `Stack${Stack.layoutIndex++}`;
    this.order = Object.keys(components);
    this.initialName = this.order[0];
  }

  getComponent(name: string) {
    if (!this.components.has(name)) {
      throw new Error(`Component not found: ${name}`);
    }

    return this.components.get(name);
  }

  getComponentById(id: string) {
    for (const component of this.components.values()) {
      if (component.id === id) {
        return component;
      }
    }

    throw new Error(`Component ID not found: ${id}`);
  }

  hasComponent(id: string) {
    try {
      this.getComponentById(id);

      return true;
    } catch (err) {
      return false;
    }
  }

  getRoot(props: Props) {
    const component = this.components.get(this.initialName);

    const layout = {
      id: this.id,
      children: [component!.getRoot(props)],
      options: { ...this.options },
    };

    return { stack: layout };
  }
}
