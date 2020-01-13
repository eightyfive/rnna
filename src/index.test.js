import { Navigation } from 'react-native-navigation';

import {
  createDrawerNavigator,
  createModalNavigator,
  createOverlayNavigator,
  createStackNavigator,
} from './index';
import * as Layout from './Layout';
import DrawerNavigator from './DrawerNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';

function ComponentA() {}
function ComponentB() {}
function Drawer() {}

test('create Stack Navigator', () => {
  const navigator = createStackNavigator({ ComponentA, ComponentB });

  expect(Navigation.registerComponent).toHaveBeenNthCalledWith(
    1,
    'ComponentA',
    expect.anything(),
  );
  expect(Navigation.registerComponent).toHaveBeenNthCalledWith(
    2,
    'ComponentB',
    expect.anything(),
  );

  expect(navigator instanceof StackNavigator).toBe(true);
  expect(navigator.stack instanceof Layout.Stack).toBe(true);
});

test('create Modal Navigator', () => {
  const navigator = createModalNavigator({ ComponentA, ComponentB });

  expect(navigator instanceof StackNavigator).toBe(true);
});

test('create Overlay Navigator', () => {
  const navigator = createOverlayNavigator({ ComponentA, ComponentB });

  expect(navigator instanceof OverlayNavigator).toBe(true);
  expect(navigator.overlay instanceof Layout.OverlayComponent).toBe(true);
});

test('create Drawer Navigator', () => {
  const navigator = createDrawerNavigator(Drawer, { ComponentA, ComponentB });

  expect(Navigation.registerComponent).toHaveBeenCalledWith(
    'Drawer',
    expect.anything(),
  );

  expect(navigator instanceof DrawerNavigator).toBe(true);
  expect(navigator.sideMenu instanceof Layout.SideMenu).toBe(true);
  expect(navigator.sideMenu.menu instanceof Layout.Component).toBe(true);
});
