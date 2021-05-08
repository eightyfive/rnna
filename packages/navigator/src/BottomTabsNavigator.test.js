import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';
import { createStack } from './index';
import { makeStack } from './StackNavigator.test';
import BottomTabsNavigator from './BottomTabsNavigator';

export function makeBottomTabs(index, stacks) {
  return {
    id: `BottomTabs${index}`,
    children: stacks.map(stack => ({ stack })),
    options: { tabsAttachMode: 'onSwitchToTab' },
  };
}

let app;

function A() {}
A.options = { topBar: { title: { text: 'Title A' } } };

function B() {}
B.options = { topBar: { title: { text: 'Title B' } } };

function C() {}
C.options = { topBar: { title: { text: 'Title C' } } };

function D() {}
D.options = { topBar: { title: { text: 'Title D' } } };

const props = { foo: 'bar' };

beforeEach(() => {
  app = new BottomTabsNavigator();

  app.addRoute('ab', createStack({ A, B }));
  app.addRoute('cd', createStack({ C, D }));

  app.getRoute('cd').push = jest.fn();

  app.mount();
});

test('mount', () => {
  expect(app.history.get()).toEqual(['ab']);

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      bottomTabs: makeBottomTabs(0, [
        makeStack([
          makeComponent('A', 'A', { topBar: { title: { text: 'Title A' } } }),
        ]),
        makeStack([
          makeComponent('C', 'C', { topBar: { title: { text: 'Title C' } } }),
        ]),
      ]),
    },
  });
});

test('render', () => {
  app.render('cd/D');

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs9', {
    bottomTabs: { currentTabIndex: 1 },
  });
  expect(app.getRoute('cd').push).toHaveBeenCalledWith('D', undefined);
});
