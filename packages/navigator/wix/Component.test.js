import { Navigation } from 'react-native-navigation';

import Component from './Component';

const component = {
  id: 'A',
  name: 'A',
  options: {},
  passProps: {},
};

test('mount', () => {
  const app = new Component('A');

  app.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component,
    },
  });
});

test('mount (options)', () => {
  const app = new Component('A', { topBar: { title: 'A Title' } });

  app.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: {
        ...component,
        options: { topBar: { title: 'A Title' } },
      },
    },
  });
});

test('mount (params)', () => {
  const app = new Component('A');

  app.mount({ foo: 'bar' });

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: {
        ...component,
        passProps: { foo: 'bar' },
      },
    },
  });
});
