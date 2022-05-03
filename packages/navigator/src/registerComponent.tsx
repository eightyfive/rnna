import React from 'react';
import { Navigation } from 'react-native-navigation';

import { Props, ReactComponent, ScreenElement } from './types';

export function registerComponent(
  name: string,
  ScreenComponent: ScreenElement,
  Provider?: ReactComponent,
) {
  if (Provider) {
    Navigation.registerComponent(
      name,
      () => (props: Props = {}) => (
        <Provider>
          <ScreenComponent {...props} />
        </Provider>
      ),
      () => ScreenComponent,
    );
  } else {
    Navigation.registerComponent(name, () => ScreenComponent);
  }
}
