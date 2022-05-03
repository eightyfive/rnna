import { FC } from 'react';
import { Options } from 'react-native-navigation';
import { Component } from './Component';
import { ComponentLayout, Props, StackLayout } from './types';
import { Stack } from './Stack';

const ScreenA: FC = () => null;
const ScreenB: FC = () => null;
const ScreenC: FC = () => null;
const ScreenD: FC = () => null;

export function createComponents() {
  const A = new Component('a', 'A', ScreenA, {
    topBar: { title: { text: 'Title A' } },
  });

  const B = new Component('b', 'B', ScreenB, {
    topBar: { title: { text: 'Title B' } },
  });

  const C = new Component('c', 'C', ScreenC, {
    topBar: { title: { text: 'Title C' } },
  });

  const D = new Component('d', 'D', ScreenD, {
    topBar: { title: { text: 'Title D' } },
  });

  return { A, B, C, D };
}

export function createStacks() {
  const { A, B, C, D } = createComponents();

  const ab = new Stack({ A, B });
  const cd = new Stack({ C, D });

  return { ab, cd };
}

export function createComponentLayout(
  id: string,
  name: string,
  options?: Options,
  props?: Props,
) {
  const layout: ComponentLayout = {
    id,
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
  index: number,
  components: ComponentLayout[],
  options = {},
) {
  return {
    id: `Stack${index}`,
    children: components.map(component => ({ component })),
    options,
  };
}

export function createBottomTabsLayout(
  index: number,
  stacks: StackLayout[],
  options?: Options,
) {
  return {
    id: `BottomTabs${index}`,
    children: stacks.map(stack => ({ stack })),
    options,
    // options: { tabsAttachMode: 'onSwitchToTab' },
  };
}
