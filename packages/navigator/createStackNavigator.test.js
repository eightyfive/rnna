import createStackNavigator from './createStackNavigator';
import ModalNavigator from './ModalNavigator';
import StackNavigator from './StackNavigator';

const A = {};
const B = {};

test('create Stack Navigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).not.toBeInstanceOf(ModalNavigator);
});
