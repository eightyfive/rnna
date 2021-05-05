import { Navigation } from 'react-native-navigation';

import Component from './Component.native';

export function makeComponent(id, name, options = {}, props = {}) {
  return {
    id,
    name,
    options,
    passProps: props,
  };
}

test('mount', () => {
  const component = new Component('A', 'A');

  component.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A', 'A'),
    },
  });
});

test('mount (options)', () => {
  const component = new Component('A', 'A', { topBar: { title: 'A Title' } });

  component.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A', 'A', { topBar: { title: 'A Title' } }),
    },
  });
});

test('mount (props)', () => {
  const component = new Component('A', 'A');

  component.mount({ foo: 'bar' });

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A', 'A', {}, { foo: 'bar' }),
    },
  });
});
