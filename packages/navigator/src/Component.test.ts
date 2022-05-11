import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from './test-utils';
import { Component } from './Component';
import { FC } from 'react';

const A1: FC = () => null;
const A2: FC = () => null;
const A3: FC = () => null;

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mount (no options)', () => {
    const component = new Component('A1', A1);

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('Component1', 'A1'),
      },
    });
  });

  test('mount (options)', () => {
    const component = new Component('A2', A2, {
      topBar: { title: { text: 'Title A2' } },
    });

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('Component2', 'A2', {
          topBar: { title: { text: 'Title A2' } },
        }),
      },
    });
  });

  test('mount (props)', () => {
    const A2: FC = () => null;
    const component = new Component('A3', A3);

    component.mount({ foo: 'bar' });

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('Component3', 'A3', undefined, {
          foo: 'bar',
        }),
      },
    });
  });
});
