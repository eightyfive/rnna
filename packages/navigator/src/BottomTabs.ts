import {
  Navigation,
  Options,
  OptionsBottomTabs,
} from 'react-native-navigation';

import { Layout } from './Layout';
import { Stack, StackLayout } from './Stack';
import { Props } from './types';

// Layout
type BottomTabsChildLayout = {
  stack: StackLayout;
};

export type BottomTabsLayout = {
  id: string;
  children: BottomTabsChildLayout[];
  options?: Options;
};

// Options
export type BottomTabsOptions = OptionsBottomTabs;

export class BottomTabs extends Layout<BottomTabsLayout, BottomTabsOptions> {
  stacks: Stack[];
  order: string[];

  constructor(stacks: Record<string, Stack>, options?: BottomTabsOptions) {
    const order = Object.keys(stacks);

    super(order.join('-'), options);

    this.stacks = Object.values(stacks);
    this.order = order;
  }

  protected getOptions(options: BottomTabsOptions): Options {
    return {
      bottomTabs: options,
    };
  }

  private getIndex(identifier: number | string) {
    if (typeof identifier === 'string') {
      // Name
      return this.order.indexOf(identifier);
    }

    // Index
    return identifier < this.order.length ? identifier : -1;
  }

  public getLayout(props?: Props) {
    const children = this.stacks.map((stack, index) =>
      stack.getRoot(index === 0 ? props : undefined),
    );

    const layout: BottomTabsLayout = {
      id: this.id,
      children,
    };

    if (this.options) {
      layout.options = this.getOptions(this.options);
    }

    return layout;
  }

  public getRoot(props?: Props) {
    return {
      bottomTabs: this.getLayout(props),
    };
  }

  public mount(props?: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });
  }

  public get(identifier: string | number) {
    const index = this.getIndex(identifier);

    if (index !== -1) {
      return this.stacks[index];
    }

    throw new Error(`Tab not found: ${identifier}`);
  }

  public select(identifier: string | number) {
    const index = this.getIndex(identifier);

    if (index === -1) {
      throw new Error(`Tab not found: ${identifier}`);
    }

    this.setOptions({ currentTabIndex: index });
  }
}
