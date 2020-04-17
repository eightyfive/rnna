import { Navigation } from 'react-native-navigation';

import Component from './Component';
import StackNavigator from './StackNavigator';
import ModalNavigator from './ModalNavigator';

let navigator;

const A = new Component('A');
const B = new Component('B');

beforeEach(() => {
  navigator = new ModalNavigator({ A, B });
  navigator.mount();
});

test('mount', () => {
  expect(navigator instanceof StackNavigator).toBe(true);

  expect(Navigation.showModal).toHaveBeenCalledWith({
    stack: {
      children: [
        { component: { id: 'A', name: 'A', options: {}, passProps: {} } },
      ],
      options: {},
    },
  });
});

test('unmount', () => {
  navigator.unmount('A');

  expect(Navigation.dismissModal).toHaveBeenCalledWith('A');
});
