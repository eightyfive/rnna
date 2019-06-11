import Navigator from "./Navigator";

export default class ComponentNavigator extends Navigator {
  constructor(navigation, component) {
    super();

    this.navigation = navigation;
    this.name = component.name;
    this.component = component;
  }

  mount() {
    this.navigation.setRoot({ root: this.component.getLayout() });
  }
}
