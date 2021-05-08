import { Navigation } from 'react-native-navigation';

import Component from './Component';

export default class Widget extends Component {
  constructor(name) {
    super(`widget-${name}`, name, {});
  }

  static register(componentName, ReactComponent) {
    Navigation.registerComponent(componentName, () => ReactComponent);

    return new Widget(componentName);
  }
}
