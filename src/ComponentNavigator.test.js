import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import ComponentNavigator from './ComponentNavigator';

test('mount', () => {
  const component = new Component('A');
  const navigator = new ComponentNavigator(component);

  navigator.mount();

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: component.getLayout(),
  });
});
