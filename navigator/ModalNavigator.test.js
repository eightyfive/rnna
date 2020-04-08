import { Navigation } from 'react-native-navigation';

import StackNavigator from './StackNavigator';
import { createModalNavigator } from './index';

let navigator;

const B = {};
const C = {};

beforeEach(() => {
  navigator = createModalNavigator({ C, B });
  navigator.mount();
});

test('mount', () => {
  expect(navigator instanceof StackNavigator).toBe(true);

  expect(Navigation.showModal).toHaveBeenCalledWith({
    stack: {
      children: [{ component: { id: 'C', name: 'C' } }],
    },
  });
});

test('unmount', () => {
  navigator.unmount('C');

  expect(Navigation.dismissModal).toHaveBeenCalledWith('C');
});
