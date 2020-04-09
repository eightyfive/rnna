import { Navigation } from 'react-native-navigation';

import Component from './Component';

test('mount', () => {
  const component = new Component('A');
  component.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: { id: 'A' },
    },
  });
});
