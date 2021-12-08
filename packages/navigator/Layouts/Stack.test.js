import { Navigation } from 'react-native-navigation';

import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from '../test-utils';
import Stack from './Stack';

let layout;

describe('Stack', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Stack.layoutIndex = 0;

    const components = createComponents();

    layout = new Stack(components);
    layout.mount();
  });

  test('mount', () => {
    expect(layout.id).toBe('Stack0');

    expect(Navigation.push).not.toHaveBeenCalled();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        stack: createStackLayout(0, [
          createComponentLayout('a', 'A', {
            topBar: {
              title: { text: 'Title A' },
            },
          }),
        ]),
      },
    });
  });
});
