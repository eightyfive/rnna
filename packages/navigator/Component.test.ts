import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from './test-utils';
import { Component } from './Component';

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mount (no options)', () => {
    const component = new Component('a1', 'A1');

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('a1', 'A1'),
      },
    });
  });

  test('mount (options)', () => {
    const component = new Component('a2', 'A2', {
      topBar: { title: { text: 'Title A2' } },
    });

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('a2', 'A2', {
          topBar: { title: { text: 'Title A2' } },
        }),
      },
    });
  });

  test('mount (props)', () => {
    const component = new Component('a3', 'A3');

    component.mount({ foo: 'bar' });

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('a3', 'A3', undefined, { foo: 'bar' }),
      },
    });
  });
});