import { Navigation } from 'react-native-navigation';
import BottomTabsNavigator from '@rnna/navigator/BottomTabsNavigator';
import ModalNavigator from '@rnna/navigator/ModalNavigator';
import OverlayNavigator from '@rnna/navigator/OverlayNavigator';
import StackNavigator from '@rnna/navigator/StackNavigator';
import { makeComponent } from '@rnna/navigator/Component.test';
import { makeStack } from '@rnna/navigator/StackNavigator.test';

import factory from './factory';

function Screen1() {}
Screen1.options = { topBar: { title: { text: 'Title 1' } } };

function Screen2() {}
Screen2.options = { topBar: { title: { text: 'Title 2' } } };

function Screen3() {}

function Screen4() {}

function Screen5() {}
Screen5.options = { layout: { componentBackgroundColor: 'dummy' } };

test('createRouter (tabs)', () => {
  const bundle = factory({
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

  const services = {};

  bundle.register(services, {}, []);
  const app = services.router;

  expect(app.get('tabs')).toBeInstanceOf(BottomTabsNavigator);
  expect(app.get('stack')).toBeInstanceOf(StackNavigator);
  expect(app.get('modal')).toBeInstanceOf(ModalNavigator);
  expect(app.get('Screen5')).toBeInstanceOf(OverlayNavigator);

  Navigation.setRoot.mockReset();
  app.render('tabs/tab1/Screen1');

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
                  'Screen1',
                  { topBar: { title: { text: 'Title 1' } } },
                  {},
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
                  'Screen2',
                  { topBar: { title: { text: 'Title 2' } } },
                  {},
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

test('createRouter (stack)', () => {
  const bundle = factory({ main: { Screen3, Screen4 } });

  const services = {};

  bundle.register(services, {}, []);
  const app = services.router;

  Navigation.setRoot.mockReset();
  app.render('main/Screen3');

  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: {
      stack: makeStack([makeComponent('main/Screen3', 'Screen3', {}, {})]),
    },
  });
});
