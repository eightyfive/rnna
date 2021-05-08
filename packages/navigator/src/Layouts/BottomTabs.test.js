import { Navigation } from 'react-native-navigation';

import { makeComponent } from './Component.test';
import { makeStack } from './Stack.test';
import BottomTabs from './BottomTabs';
import Component from './Component';
import Stack from './Stack';

function makeBottomTabs(index, stacks) {
  return {
    id: `BottomTabs${index}`,
    children: stacks.map(stack => ({ stack })),
    options: { tabsAttachMode: 'onSwitchToTab' },
  };
}

function createBottomTabs() {
  const A = new Component('A', 'A', { topBar: { title: { text: 'Title A' } } });
  const B = new Component('B', 'B', { topBar: { title: { text: 'Title B' } } });
  const C = new Component('C', 'C', { topBar: { title: { text: 'Title C' } } });
  const D = new Component('D', 'D', { topBar: { title: { text: 'Title D' } } });

  const ab = new Stack({ A, B });
  const cd = new Stack({ C, D });

  return new BottomTabs({ ab, cd });
}

let app;

beforeEach(() => {
  app = createBottomTabs();
  app.mount();
});

test('mount', () => {
  expect(app.ab).toBeInstanceOf(Stack);
  expect(app.cd).toBeInstanceOf(Stack);

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

test('select tab', () => {
  app.selectTab(1);

  expect(Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs9', {
    bottomTabs: { currentTabIndex: 1 },
  });
});
