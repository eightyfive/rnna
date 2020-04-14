import createModalNavigator from './createModalNavigator';
import ModalNavigator from './ModalNavigator';
import StackNavigator from './StackNavigator';

const A = {};
const B = {};

test('create Modal Navigator', () => {
  const navigator = createModalNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).toBeInstanceOf(ModalNavigator);
});
