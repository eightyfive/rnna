import { Navigation } from 'react-native-navigation';

// import Component from './Component';
import StackNavigator from './StackNavigator';

export default class SideMenuNavigator extends StackNavigator {
  constructor(config = {}) {
    // if (!config.drawer) {
    //   throw new Error('config.drawer is required');
    // }

    // if (!(config.drawer instanceof Component)) {
    //   throw new Error('config.drawer must be of type `Component`');
    // }

    super(config);

    this.drawer = config.drawer;
    this.drawerPosition = config.drawerPosition || 'left';
    this.visible = false;

    this.addListener('ComponentDidAppear', this.handleDidAppear);
    this.addListener('ComponentDidDisappear', this.handleDidDisappear);
  }

  handleDidAppear = ({ componentId: id }) => {
    if (id === this.drawer.id) {
      this.visible = true;
    }
  };

  handleDidDisappear = ({ componentId: id }) => {
    if (id === this.drawer.id) {
      this.visible = false;
    }
  };

  mount(initialProps) {
    Navigation.setRoot({ root: this.getInitialLayout(initialProps) });
  }

  getLayout(props, routeName) {
    const layout = {
      center: super.getLayout(props, routeName),
      [this.drawerPosition]: this.drawer.getLayout(props),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { sideMenu: layout };
  }
}
