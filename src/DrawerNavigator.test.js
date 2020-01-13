import { Navigation } from 'react-native-navigation';

import Component from './Layout/Component';
import Stack from './Layout/Stack';
import StackNavigator from './StackNavigator';
import DrawerNavigator from './DrawerNavigator';
import SideMenu from './Layout/SideMenu';

let navigator;

// Stack
const componentA = new Component('a');
const componentB = new Component('b');

const stack = new Stack('stack', [componentA, componentB]);
const stackNavigator = new StackNavigator('STACK', stack);

// Side menu
const drawer = new Component('drawer');
const sideMenu = new SideMenu(drawer, stack);

const params = { foo: 'bar' };

beforeEach(() => {
  navigator = new DrawerNavigator('DRAWER', sideMenu);
  navigator.mount();
});

test('navigate', () => {
  navigator.navigate('a');
  expect(Navigation.mergeOptions).not.toHaveBeenCalled();
});

test('go back', () => {
  navigator.navigate('b');
  navigator.goBack('b');

  expect(Navigation.mergeOptions).not.toHaveBeenCalled();
});

test('mount', () => {
  expect(Navigation.setRoot).toHaveBeenCalledWith({
    root: sideMenu.getLayout('a'),
  });
});

test('open drawer', () => {
  navigator.navigate('drawer');
  expect(Navigation.mergeOptions).toHaveBeenCalledWith(
    'drawer',
    sideMenu.getVisibleLayout(true),
  );
});

test('close drawer', () => {
  navigator.navigate('drawer');
  navigator.handleDidAppear({ componentId: 'drawer' });
  navigator.goBack();

  expect(Navigation.mergeOptions).toHaveBeenCalledWith(
    'drawer',
    sideMenu.getVisibleLayout(false),
  );
});
