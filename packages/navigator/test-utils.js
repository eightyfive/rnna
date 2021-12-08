import Component from './Layouts/Component';
import Stack from './Layouts/Stack';

export function createComponents() {
  const A = new Component('a', 'A', { topBar: { title: { text: 'Title A' } } });
  const B = new Component('b', 'B', { topBar: { title: { text: 'Title B' } } });
  const C = new Component('c', 'C', { topBar: { title: { text: 'Title C' } } });
  const D = new Component('d', 'D', { topBar: { title: { text: 'Title D' } } });

  return { A, B, C, D };
}

export function createStacks() {
  const { A, B, C, D } = createComponents();

  const ab = new Stack({ A, B });
  const cd = new Stack({ C, D });

  return { ab, cd };
}

export function createComponentLayout(id, name, options = {}, props = {}) {
  return {
    id,
    name,
    options,
    passProps: props,
  };
}

export function createStackLayout(index, components, options = {}) {
  return {
    id: `Stack${index}`,
    children: components.map(component => ({ component })),
    options,
  };
}
