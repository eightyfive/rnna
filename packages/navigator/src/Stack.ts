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
    const id = components.map(({ name }) => name).join('-');

    super(id, options);

    this.components = components;
  }

  protected getOptions(options: OptionsT): Options {
    return {
      bottomTab: options,
    };
  }

  private getIndex(identifier: number | string) {
    if (typeof identifier === 'string') {
      // Name
      return this.components.findIndex(({ name }) => name === identifier);
    }

    // Index
    return identifier < this.components.length ? identifier : -1;
  }

  public getLayout(props?: Props) {
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

  public getRoot(props?: Props) {
    return {
      stack: this.getLayout(props),
    };
  }

  public mount(props?: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });
  }

  public push(identifier: string | number, props?: Props) {
    const index = this.getIndex(identifier);

    if (index === -1) {
      throw new Error(`Component not found (push): ${identifier}`);
    }

    const componentTo = this.components[index];

    Navigation.push(this.id, componentTo.getRoot(props));
  }

  public pop() {
    Navigation.pop(this.id);
  }

  public popTo(identifier: string | number) {
    const index = this.getIndex(identifier);

    if (index === -1) {
      throw new Error(`Component not found (popTo): ${identifier}`);
    }

    const componentTo = this.components[index];

    Navigation.popTo(componentTo.id);
  }

  public popToRoot() {
    Navigation.popToRoot(this.id);
  }

  public get(identifier: string | number) {
    const index = this.getIndex(identifier);

    if (index !== -1) {
      return this.components[index];
    }

    throw new Error(`Component not found: ${identifier}`);
  }

  public setTitle(identifier: string | number, title: string) {
    const component = this.get(identifier);

    component.setOptions({
      topBar: {
        title: {
          text: title,
        },
      },
    });
  }
}
