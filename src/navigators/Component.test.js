import { Navigation } from 'react-native-navigation';

import Component from './Component';

test('mount', () => {
  const navigator = new Componentfrom('A');
  navigator.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      component: {
        id: 'A',
        name: 'A',
      },
    },
  });
});
