import { Navigation } from 'react-native-navigation';

import { ScreenElement, ReactComponent } from './types';
import { Props } from './Layout';

export function registerScreen(
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
