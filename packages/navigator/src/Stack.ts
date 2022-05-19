import { Navigation, Options, OptionsBottomTab } from 'react-native-navigation';

import { Component, ComponentLayout } from './Component';
import { Layout } from './Layout';
import { Props } from './types';

// Layout
type StackChildLayout = {
  component: ComponentLayout;
};

export type StackLayout = {
  id: string;
  children: StackChildLayout[];
  options?: Options;
};

// Options
export type StackOptions = OptionsBottomTab;

export class Stack<OptionsT = StackOptions> extends Layout<
  StackLayout,
  OptionsT
> {
  components: Component[];

  constructor(components: Component[], options?: OptionsT) {
    const id = components.map(component => component.name).join('-');

    super(id, options);

    this.components = components;
  }

  getLayout(props?: Props) {
    const component = Array.from(this.components).shift();

    const layout: StackLayout = {
      id: this.id,
      children: component ? [component.getRoot(props)] : [],
    };

    if (this.options) {
      layout.options = this.getOptions(this.options);
    }

    return layout;
  }

  getOptions(options: OptionsT): Options {
    return {
      bottomTab: options,
    };
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

  push(name: string, props?: Props) {
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

  popTo(name: string) {
    const componentTo = this.components.find(
      component => component.name === name,
    );

    if (!componentTo) {
      throw new Error(`Component not found (popTo): ${name}`);
    }

    Navigation.popTo(componentTo.id);
  }

  popToRoot() {
    Navigation.popToRoot(this.id);
  }
}
