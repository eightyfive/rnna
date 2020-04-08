import {
  createDrawerNavigator,
  createModalNavigator,
  createOverlayNavigator,
  createRootNavigator,
  createStackNavigator,
  createWidget,
} from './index';

import Component from './Component';
import BottomTabsNavigator from './BottomTabsNavigator';
import DrawerNavigator from './DrawerNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';
import WidgetComponent from './WidgetComponent';

const A = { componentId: 'A' };
const B = { componentId: 'B' };
const Drawer = { componentId: 'Drawer' };

test('create Stack Navigator', () => {
  const navigator = createStackNavigator({ A, B });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Modal Navigator', () => {
  const navigator = createModalNavigator({ A, B });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Overlay Navigator', () => {
  const navigator = createOverlayNavigator({ A });

  expect(navigator instanceof OverlayNavigator).toBe(true);
});

// test('create Drawer Navigator', () => {
//   const navigator = createDrawerNavigator(
//     { A, B },
//     { contentComponent: Drawer },
//   );

//   expect(navigator instanceof DrawerNavigator).toBe(true);
//   expect(navigator.drawer instanceof Component).toBe(true);
// });

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

  stack: {
    Login: {
      title: 'Sign In',
      topBar: {
        visible: false,
      },
    },
  },

  modal: {
    Screen: {},
    options: {
      mode: 'modal',
    },
  },

  Overlay: {
    layout: {
      componentBackgroundColor: 'transparent',
    },
  },
};

test('create Root Navigator', () => {
  const navigator = createRootNavigator(routes);

  expect(navigator.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(navigator.get('stack')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(navigator.get('Overlay')).toBeInstanceOf(OverlayNavigator);
});
