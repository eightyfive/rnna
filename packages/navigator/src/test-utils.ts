import { Options } from 'react-native-navigation';
import { Component, ComponentLayout } from './Component';
import { Props } from './types';
import { Stack, StackLayout, StackOptions } from './Stack';
import { BottomTabsLayout } from './BottomTabs';

export function createComponents() {
  const A = new Component('A');
  const B = new Component('B');
  const C = new Component('C');
  const D = new Component('D');

  return [A, B, C, D];
}

export function createStacks() {
  const [A, B, C, D] = createComponents();

  const ab = new Stack([A, B]);
  const cd = new Stack([C, D]);

  return { ab, cd };
}

export function createComponentLayout(
  name: string,
  options?: Options,
  props?: Props,
) {
  const layout: ComponentLayout = {
    id: name,
    name,
  };

  if (options) {
    layout.options = options;
  }

  if (props) {
    layout.passProps = props;
  }

  return layout;
}

export function createStackLayout(
  id: string,
  components: ComponentLayout[],
  options?: Options,
) {
  const layout: StackLayout = {
    id,
    children: components.map(component => ({ component })),
  };

  if (options) {
    layout.options = options;
  }

  return layout;
}

export function createBottomTabsLayout(
  id: string,
  stacks: StackLayout[],
  options?: Options,
) {
  const layout: BottomTabsLayout = {
    id,
    children: stacks.map(stack => ({ stack })),
  };

  if (options) {
    layout.options = options;
  }

  return layout;
}
