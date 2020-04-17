import { Navigation } from 'react-native-navigation';

import { ModalNavigator, OverlayNavigator, WidgetComponent } from './wix';

import { makeComponent } from './wix/Component.test';
import { makeStack } from './wix/StackNavigator.test';

import BottomTabNavigator from './BottomTabNavigator';
import StackNavigator from './StackNavigator';

import {
  createStackNavigator,
  createRootNavigator,
  createWidget,
} from './index';

test('createWidget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

test('createRootNavigator (tabs)', () => {
  const app = createRootNavigator({
    tabs: {
      tab1: {
        Screen1: { title: 'Title 1' },
        options: { bottomTab: { text: 'Title 1' } },
      },
      tab2: {
        Screen2: { title: 'Title 2' },
        options: { bottomTab: { text: 'Title 2' } },
      },
    },

    stack: {
      Screen3: {},
    },

    modal: {
      Screen4: {},
      config: { mode: 'modal' },
    },

    overlay: {
      Screen5: { layout: { componentBackgroundColor: 'dummy' } },
      config: { mode: 'overlay' },
    },
  });

  expect(app.get('tabs')).toBeInstanceOf(BottomTabNavigator);
  expect(app.get('stack')).toBeInstanceOf(StackNavigator);
  expect(app.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(app.get('overlay')).toBeInstanceOf(OverlayNavigator);

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
  const app = createRootNavigator({
    auth: {
      Login: {},
      Register: {},
    },
  });

  Navigation.setRoot.mockReset();
  app.go('auth/Login');

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([makeComponent('auth/Login', {}, {}, 'Login')]),
    },
  });
});

const A = {};
const B = {};

// Bottom tabs
// TODO

// Modal
test('createModalNavigator', () => {
  const app = createStackNavigator({ A, B }, {}, { mode: 'modal' });

  expect(app).toBeInstanceOf(ModalNavigator);
});

// Overlay
test('createOverlayNavigator', () => {
  const app = createStackNavigator({ A }, {}, { mode: 'overlay' });

  expect(app).toBeInstanceOf(OverlayNavigator);
});

// Stack
test('createStackNavigator', () => {
  const app = createStackNavigator({ A, B });

  expect(app).toBeInstanceOf(StackNavigator);
  expect(app).not.toBeInstanceOf(ModalNavigator);
});
