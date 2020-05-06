/**
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { createStackNavigator } from '@rnna/navigator';
import { name as appName } from './app.json';
import App from './App';

// Screens
const Test = () => <Text style={{ padding: 24 }}>Test screen</Text>;

Navigation.registerComponent('App', () => App);
Navigation.registerComponent('Test', () => Test);

// Navigator
const navigator = createStackNavigator({
  App: { title: appName },
  Test: { title: 'Test screen' },
});

Navigation.events().registerAppLaunchedListener(() =>
  navigator.mount({
    nav: navigator,
  }),
);
