import { Navigation } from 'react-native-navigation';

import {
  BottomTabsNavigator,
  ModalNavigator,
  OverlayNavigator,
  StackNavigator,
  WidgetComponent,
} from './wix';

import {
  createStackNavigator,
  createRootNavigator,
  createWidget,
} from './index';

test('create Widget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

test('create Root Navigator (tabs)', () => {
  const app = createRootNavigator({
    tabs: {
      tab1: {
        Screen1: {},
        config: { options: { bottomTab: { text: 'Title 1' } } },
      },
      tab2: {
        Screen2: {},
        config: { options: { bottomTab: { text: 'Title 2' } } },
      },
    },

    stack: {
      Screen3: {},
    },

    modal: {
      Screen4: {},
      config: { mode: 'modal' },
    },

    Overlay: {
      layout: { componentBackgroundColor: 'dummy' },
    },
  });

  expect(app.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(app.get('stack')).toBeInstanceOf(StackNavigator);
  expect(app.get('modal')).toBeInstanceOf(StackNavigator);
  expect(app.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(app.get('Overlay')).toBeInstanceOf(OverlayNavigator);

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
                  },
                },
              ],
              options: { bottomTab: { text: 'Title 2' } },
            },
          },
        ],
      },
    },
  });
});

test('create Root Navigator (stack)', () => {
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
          { component: { id: 'auth/Login', name: 'Login', options: {} } },
        ],
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
  const navigator = createStackNavigator({ A, B }, { mode: 'modal' });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).toBeInstanceOf(ModalNavigator);
});

// Overlay
test('createOverlayNavigator', () => {
  const navigator = createOverlayNavigator({ A }, { mode: 'overlay' });

  expect(navigator).toBeInstanceOf(OverlayNavigator);
});

// Stack
test('createStackNavigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator).toBeInstanceOf(StackNavigator);
  expect(navigator).not.toBeInstanceOf(ModalNavigator);
});
