import { Navigation } from 'react-native-navigation';

import Component from './Component.native';

export default class WidgetComponent extends Component {
  constructor(name) {
    super(`widget-${name}`, name, {});
  }

  static register(componentName, Widget) {
    Navigation.registerComponent(componentName, () => Widget);

    return new WidgetComponent(componentName);
  }
}
