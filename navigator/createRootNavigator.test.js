import createRootNavigator from './createRootNavigator';

import BottomTabsNavigator from './BottomTabsNavigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';

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
