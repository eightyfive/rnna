import { Options } from 'react-native-navigation';
import { ComponentLayout, ComponentLayoutType } from './ComponentLayout';
import { Layout, Props } from './Layout';

type StackChildLayoutType = {
  component: ComponentLayoutType;
};

type StackLayoutType = {
  id: string;
  children: StackChildLayoutType[];
  options?: Options;
};

export class StackLayout extends Layout<StackLayoutType, 'stack'> {
  static layoutIndex = 0;

  components: Map<string, ComponentLayout>;
  id: string;
  order: string[];
  initialName: string;

  constructor(components: Record<string, ComponentLayout>, config = {}) {
    super(config);

    this.components = new Map(Object.entries(components));
    this.id = `Stack${StackLayout.layoutIndex++}`;
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

  getLayout(props: Props) {
    const component = this.components.get(this.initialName);

    const layout: StackLayoutType = {
      id: this.id,
      children: [component!.getRoot(props)],
    };

    if (this.hasOptions()) {
      layout.options = { ...this.options };
    }

    return layout;
  }

  getRoot(props: Props) {
    return {
      stack: this.getLayout(props),
    };
  }
}
