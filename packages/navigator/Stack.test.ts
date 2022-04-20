import { Navigation } from 'react-native-navigation';

import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from './test-utils';
import { Stack } from './Stack';

let app: Stack;

const props = { foo: 'bar' };

describe('Stack', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Stack.layoutIndex = 0;

    const components = createComponents();

    app = new Stack(components);
    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('Stack0');

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

    expect(app.history).toEqual(['A']);
  });

  test('push', () => {
    app.push('B', props);

    expect(app.history).toEqual(['A', 'B']);

    expect(Navigation.push).toHaveBeenCalledWith('a', {
      component: createComponentLayout(
        'b',
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

    expect(app.history).toEqual(['A', 'B']);
    expect(Navigation.pop).toHaveBeenCalledWith('c');
  });

  test('popToRoot', () => {
    app.push('B', props);
    app.push('C', props);
    app.popToRoot();

    expect(app.history).toEqual(['A']);
    expect(Navigation.popToRoot).toHaveBeenCalledWith('c');
  });
});
