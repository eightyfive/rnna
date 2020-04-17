import { Navigation } from 'react-native-navigation';

import Component from './Component';

export function makeComponent(id, options = {}, params = {}, name = null) {
  return {
    id: id,
    name: name || id,
    options,
    passProps: params,
  };
}

test('mount', () => {
  const component = new Component('A');

  component.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A'),
    },
  });
});

test('mount (options)', () => {
  const component = new Component('A', { topBar: { title: 'A Title' } });

  component.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A', { topBar: { title: 'A Title' } }),
    },
  });
});

test('mount (params)', () => {
  const component = new Component('A');

  component.mount({ foo: 'bar' });

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: makeComponent('A', {}, { foo: 'bar' }),
    },
  });
});
