import { Navigation } from 'react-native-navigation';

import {
  createComponentLayout,
  createStacks,
  createBottomTabsLayout,
  createStackLayout,
} from './test-utils';
import { BottomTabs } from './BottomTabs';

let app: BottomTabs;

const options = {
  animate: true,
  backgroundColor: 'red',
};

describe('BottomTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const stacks = createStacks();

    app = new BottomTabs(stacks, options);

    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('ab-cd');

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        bottomTabs: createBottomTabsLayout(
          'ab-cd',
          [
            createStackLayout('A-B', [createComponentLayout('A')]),
            createStackLayout('C-D', [createComponentLayout('C')]),
          ],
          {
            bottomTabs: options,
          },
        ),
      },
    });
  });

  test('get tab(1)', () => {
    const stack = app.get(1);

    expect(stack.id).toBe('C-D');
  });

  test("get tab('ab')", () => {
    const stack = app.get('ab');

    expect(stack.id).toBe('A-B');
  });

  test('select tab(1)', () => {
    app.select(1);

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-cd', {
      bottomTabs: { currentTabIndex: 1 },
    });
  });

  test("select tab('ab')", () => {
    app.select('ab');

    expect(Navigation.mergeOptions).toHaveBeenCalledWith('ab-cd', {
      bottomTabs: { currentTabIndex: 0 },
    });
  });
});
