import React from 'react';
import { Navigation } from 'react-native-navigation';
import _forEach from 'lodash.foreach';

export default function registerComponents(
  screens,
  Provider = null,
  store = null,
) {
  _forEach(screens, (Screen, componentName) => {
    if (Provider) {
      Navigation.registerComponent(
        componentName,
        () => props => (
          <Provider {...{ store }}>
            <Screen {...props} />
          </Provider>
        ),
        () => Screen,
      );
    } else {
      Navigation.registerComponent(componentName, () => Screen);
    }
  });
}
