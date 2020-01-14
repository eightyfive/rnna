import { Navigation } from 'react-native-navigation';

import ComponentNavigator from './ComponentNavigator';

test('mount', () => {
  const navigator = new ComponentNavigator('A');
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
