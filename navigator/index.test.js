import { createWidget, createRootNavigator } from './index';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import StackNavigator from './StackNavigator';
import OverlayNavigator from './OverlayNavigator';
import WidgetComponent from './WidgetComponent';

test('create Widget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});

const routes = {
  tabs: {
    tab1: {
      Users: { title: 'Users' },
      User: {},
      defaultOptions: {
        bottomTab: {
          text: 'Users',
        },
      },
    },

    tab2: {
      Profile: { title: 'My Profile' },
      Settings: {},
      defaultOptions: {
        bottomTab: {
          text: 'Profile',
        },
      },
    },
  },

  auth: {
    Login: {},
    Register: {},
  },

  modal: {
    Screen1: {},
    Screen2: {},
    config: {
      mode: 'modal',
    },
  },

  Overlay: {
    layout: {
      componentBackgroundColor: 'transparent',
    },
  },
};
const navigator = createRootNavigator(routes);

test('create Root Navigator', () => {
  expect(navigator.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(navigator.get('auth')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(navigator.get('Overlay')).toBeInstanceOf(OverlayNavigator);
});

test('build Routes', () => {
  expect(navigator.buildRoutes()).toEqual({
    Login: 'auth/Login',
    Register: 'auth/Register',
    Overlay: 'Overlay/Overlay',
    Profile: 'tabs/tab2/Profile',
    Screen1: 'modal/Screen1',
    Screen2: 'modal/Screen2',
    Settings: 'tabs/tab2/Settings',
    User: 'tabs/tab1/User',
    Users: 'tabs/tab1/Users',
  });
});
