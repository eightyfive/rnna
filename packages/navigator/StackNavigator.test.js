import { Navigation } from 'react-native-navigation';

import { createComponents, createComponentLayout } from './test-utils';
import StackNavigator from './StackNavigator';

let app;

const props = { foo: 'bar' };

describe('StackNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const components = createComponents();

    app = new StackNavigator(components);
    app.mount();
  });

  test('mount', () => {
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
