import React from 'react';
import { Navigation } from 'react-native-navigation';

export default function registerComponents(
  screens,
  Provider = null,
  store = null,
) {
  for (const [name, Screen] of Object.entries(screens)) {
    if (Provider) {
      Navigation.registerComponent(
        name,
        () => props => (
          <Provider {...{ store }}>
            <Screen {...props} />
          </Provider>
        ),
        () => Screen,
      );
    } else {
      Navigation.registerComponent(name, () => Screen);
    }
  }
}
