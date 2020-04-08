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

  stack: {
    Login: {
      title: 'Sign In',
    },
  },

  modal: {
    Screen: {},
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

test('create Root Navigator', () => {
  const navigator = createRootNavigator(routes);

  expect(navigator.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(navigator.get('stack')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(StackNavigator);
  expect(navigator.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(navigator.get('Overlay')).toBeInstanceOf(OverlayNavigator);
});
