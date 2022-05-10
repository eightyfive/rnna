import { Navigation } from 'react-native-navigation';

import { Component } from './Component';
import { Layout } from './Layout';
import { Props, ReactComponent, StackLayout } from './types';

export class Stack extends Layout<StackLayout> {
  static layoutIndex = 0;

  components: Component[];

  constructor(components: Record<string, Component>, options = {}) {
    super(`Stack${Stack.layoutIndex++}`, options);

    this.components = Object.values(components);
  }

  getLayout(props?: Props) {
    const component = Array.from(this.components).shift();

    const layout: StackLayout = {
      id: this.id,
      children: component ? [component.getRoot(props)] : [],
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

  mount(props?: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });
  }

  push(name: string, props: Props) {
    const componentTo = this.components.find(
      component => component.name === name,
    );

    if (!componentTo) {
      throw new Error(`Component not found (push): ${name}`);
    }

    Navigation.push(this.id, componentTo.getRoot(props));
  }

  pop() {
    Navigation.pop(this.id);
  }

  popTo(id: string) {
    const componentTo = this.components.find(component => component.id === id);

    if (!componentTo) {
      throw new Error(`Component not found (popTo): ${id}`);
    }

    Navigation.popTo(componentTo.id);
  }

  popToRoot() {
    Navigation.popToRoot(this.id);
  }

  register(Provider?: ReactComponent) {
    this.components.forEach(component => {
      component.register(Provider);
    });
  }
}
