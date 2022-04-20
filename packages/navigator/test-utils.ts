import { Options } from 'react-native-navigation';
import { Component, ComponentLayout } from './Component';
import { Props } from './Layout';
import { Stack } from './Stack';

export function createComponents() {
  const A = new Component('a', 'A', {
    topBar: { title: { text: 'Title A' } },
  });
  const B = new Component('b', 'B', {
    topBar: { title: { text: 'Title B' } },
  });
  const C = new Component('c', 'C', {
    topBar: { title: { text: 'Title C' } },
  });
  const D = new Component('d', 'D', {
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
