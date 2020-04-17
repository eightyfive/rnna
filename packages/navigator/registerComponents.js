import { Navigation } from 'react-native-navigation';
import React from 'react';

const o = {
  entries: Object.entries,
};

export default function registerComponents(
  screens,
  Provider = null,
  store = null,
) {
  for (const [componentName, Screen] of o.entries(screens)) {
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
  }
}
