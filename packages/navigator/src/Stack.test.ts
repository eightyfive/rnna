import { Navigation } from 'react-native-navigation';

import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from './test-utils';
import { Layout } from './Layout';
import { Stack } from './Stack';

let app: Stack;

const props = { foo: 'bar' };

describe('Stack', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Layout.layoutIndex = 0;

    const components = createComponents();

    app = new Stack(components);
    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('Stack5');

    expect(Navigation.push).not.toHaveBeenCalled();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        stack: createStackLayout('Stack5', [
          createComponentLayout('Component1', 'A', {
            topBar: {
              title: { text: 'Title A' },
            },
          }),
        ]),
      },
    });
  });

  test('push', () => {
    app.push('B', props);

    expect(Navigation.push).toHaveBeenCalledWith('Stack5', {
      component: createComponentLayout(
        'Component2',
        'B',
        {
          topBar: {
            title: { text: 'Title B' },
          },
        },
        props,
      ),
    });
  });

  test('pop', () => {
    app.push('B', props);
    app.push('C', props);
    app.pop();

    expect(Navigation.pop).toHaveBeenCalledWith('Stack5');
  });

  test('popToRoot', () => {
    app.push('B', props);
    app.push('C', props);
    app.popToRoot();

    expect(Navigation.popToRoot).toHaveBeenCalledWith('Stack5');
  });
});
