import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from '../test-utils';
import { ComponentLayout } from './ComponentLayout';

function ComponentA1() {}
function ComponentA2() {}
function ComponentA3() {}

describe('ComponentLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('mount', () => {
    const component = new ComponentLayout('a1', 'A1', ComponentA1);

    component.mount();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('a1', 'A1'),
      },
    });
  });

  test('mount (options)', () => {
    const component = new ComponentLayout('a2', 'A2', ComponentA2, {
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
    const component = new ComponentLayout('a3', 'A3', ComponentA3);

    component.mount({ foo: 'bar' });

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        component: createComponentLayout('a3', 'A3', {}, { foo: 'bar' }),
      },
    });
  });
});
