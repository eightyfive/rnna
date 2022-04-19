import {
  Navigation,
  Options,
  ScreenPoppedEvent,
} from 'react-native-navigation';

import { Props } from './Layout';
import { ComponentLayout, Component } from './Component';
import { Layout } from './Layout';

type StackChildLayout = {
  component: ComponentLayout;
};

export type StackLayout = {
  id: string;
  children: StackChildLayout[];
  options?: Options;
};

type ScreenPoppedListener = (ev: ScreenPoppedEvent) => void;

export class StackNavigator extends Layout<StackLayout> {
  static layoutIndex = 0;

  components: Map<string, Component>;
  order: string[];
  initialName: string;
  history: string[];

  constructor(components: Record<string, Component>, options = {}) {
    super(`Stack${StackNavigator.layoutIndex++}`, options);

    this.components = new Map(Object.entries(components));
    this.history = [];
    this.order = Object.keys(components);
    this.initialName = this.order[0];

    this.onScreenPopped(this.handleScreenPopped);
  }

  onScreenPopped(listener: ScreenPoppedListener) {
    Navigation.events().registerScreenPoppedListener(listener);
  }

  get componentName() {
    return Array.from(this.history).pop() || null;
  }

  get component() {
    if (this.componentName) {
      return this.components.get(this.componentName);
    }

    return null;
  }

  handleScreenPopped = (ev: ScreenPoppedEvent) => {
    try {
      const component = this.getComponentById(ev.componentId);

      if (this.componentName === component.name) {
        this.history.pop();
      }
    } catch (err) {
      // Ignore
    }
  };

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

  getLayout(props?: Props) {
    const component = this.components.get(this.initialName);

    const layout: StackLayout = {
      id: this.id,
      children: [component!.getRoot(props)],
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return layout;
  }

  getRoot(props?: Props) {
    return {
      stack: this.getLayout(props),
    };
  }

  init() {
    this.history = [this.initialName];
  }

  mount(props: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });

    this.init();
  }

  push(name: string, props: Props) {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    const componentTo = this.components.get(name);

    if (!componentTo) {
      throw new Error(`Component not found: ${name}`);
    }

    Navigation.push(this.component.id, componentTo.getRoot(props));

    this.history.push(name);
  }

  pop() {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    Navigation.pop(this.component.id);

    this.history.pop();
  }

  popTo(id: string) {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    const component = this.getComponentById(id);

    if (!this.history.includes(component.name)) {
      throw new Error(`Component not in stack: ${component.id}`);
    }

    Navigation.popTo(component.id);

    const index = this.history.indexOf(component.name);

    this.history.splice(index + 1);
  }

  popToRoot() {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Already stack root');
    }

    Navigation.popToRoot(this.component.id);

    this.init();
  }
}
