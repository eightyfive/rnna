import { Navigation } from 'react-native-navigation';

import { ModalNavigator, OverlayNavigator, WidgetComponent } from './wix';

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
        Screen1: {},
        options: { bottomTab: { text: 'Title 1' } },
      },
      tab2: {
        Screen2: {},
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
            stack: {
              children: [
                {
                  component: {
                    id: 'tabs/tab1/Screen1',
                    name: 'Screen1',
                    options: {},
                    passProps: {},
                  },
                },
              ],
              options: { bottomTab: { text: 'Title 1' } },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    id: 'tabs/tab2/Screen2',
                    name: 'Screen2',
                    options: {},
                    passProps: {},
                  },
                },
              ],
              options: { bottomTab: { text: 'Title 2' } },
            },
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
      stack: {
        children: [
          {
            component: {
              id: 'auth/Login',
              name: 'Login',
              options: {},
              passProps: {},
            },
          },
        ],
        options: {},
      },
    },
  });
});

const A = {};
const B = {};

// Bottom tabs
// TODO

// Modal
test('createModalNavigator', () => {
  const navigator = createStackNavigator({ A, B }, {}, { mode: 'modal' });

  expect(navigator).toBeInstanceOf(ModalNavigator);
});

// Overlay
test('createOverlayNavigator', () => {
  const navigator = createStackNavigator({ A }, {}, { mode: 'overlay' });

  expect(navigator).toBeInstanceOf(OverlayNavigator);
});

// Stack
test('createStackNavigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).not.toBeInstanceOf(ModalNavigator);
});
