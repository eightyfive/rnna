import { Navigation } from 'react-native-navigation';

import { ModalNavigator, OverlayNavigator, WidgetComponent } from './wix';

import { makeComponent } from './wix/Component.test';
import { makeStack } from './wix/StackNavigator.test';

import BottomTabsNavigator from './BottomTabsNavigator';
import StackNavigator from './StackNavigator';

import {
  createStackNavigator,
  createRootNavigator,
  createWidget,
} from './index';

function Screen1() {}
Screen1.options = { title: 'Title 1' };

function Screen2() {}
Screen2.options = { title: 'Title 2' };

function Screen3() {}

function Screen4() {}

function Screen5() {}
Screen5.options = { layout: { componentBackgroundColor: 'dummy' } };

test('createWidget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

test('createRootNavigator (tabs)', () => {
  const app = createRootNavigator({
    tabs: {
      tab1: {
        Screen1,
        options: { bottomTab: { text: 'Title 1' } },
      },
      tab2: {
        Screen2,
        options: { bottomTab: { text: 'Title 2' } },
      },
    },

    stack: {
      Screen3,
      config: { foo: 'modal' },
    },

    modal: {
      Screen4,
      config: { mode: 'modal' },
    },

    Screen5,
  });

  expect(app.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(app.get('stack')).toBeInstanceOf(StackNavigator);
  expect(app.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(app.get('Screen5')).toBeInstanceOf(OverlayNavigator);

  Navigation.setRoot.mockReset();
  app.go('tabs/tab1/Screen1');

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      bottomTabs: {
        id: 'tab1-tab2',
        children: [
          {
            stack: makeStack(
              [
                makeComponent(
                  'tabs/tab1/Screen1',
                  { topBar: { title: { text: 'Title 1' } } },
                  {},
                  'Screen1',
                ),
              ],
              { bottomTab: { text: 'Title 1' } },
            ),
          },
          {
            stack: makeStack(
              [
                makeComponent(
                  'tabs/tab2/Screen2',
                  { topBar: { title: { text: 'Title 2' } } },
                  {},
                  'Screen2',
                ),
              ],
              { bottomTab: { text: 'Title 2' } },
            ),
          },
        ],
        options: {},
      },
    },
  });
});

test('createRootNavigator (stack)', () => {
  const app = createRootNavigator({ main: { Screen3, Screen4 } });

  Navigation.setRoot.mockReset();
  app.go('main/Screen3');

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([makeComponent('main/Screen3', {}, {}, 'Screen3')]),
    },
  });
});

// Bottom tabs
// TODO

// Modal
test('createModalNavigator', () => {
  const app = createStackNavigator({ Screen1, Screen2 }, {}, { mode: 'modal' });

  expect(app).toBeInstanceOf(ModalNavigator);
});

// // Overlay
// test('createOverlayNavigator', () => {
//   const app = createStackNavigator({ Screen1 }, {}, { mode: 'overlay' });

//   expect(app).toBeInstanceOf(OverlayNavigator);
// });

// Stack
test('createStackNavigator', () => {
  const app = createStackNavigator({ Screen1, Screen2 });

  expect(app).toBeInstanceOf(StackNavigator);
  expect(app).not.toBeInstanceOf(ModalNavigator);
});
