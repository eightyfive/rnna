import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from './test-utils';
import { Component } from './Component';

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mount (no options)', () => {
    const component = new Component('A');

    expect(component.id).toBe('A');

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('A'),
      },
    });
  });

  test('mount (options)', () => {
    const component = new Component('B');

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('B'),
      },
    });
  });

  test('mount (props)', () => {
    const component = new Component('C');

    component.mount({ foo: 'bar' });

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('C', undefined, {
          foo: 'bar',
        }),
      },
    });
  });
});
