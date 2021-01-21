import { Navigation } from 'react-native-navigation';

// import Component from './Component';
import StackNavigator from './StackNavigator';

export default class SideMenuNavigator extends StackNavigator {
  constructor(routes, options = {}, config = {}) {
    // if (!config.drawer) {
    //   throw new Error('config.drawer is required');
    // }

    // if (!(config.drawer instanceof Component)) {
    //   throw new Error('config.drawer must be of type `Component`');
    // }

    super(routes, options, config);

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

  mount(params) {
    Navigation.setRoot({ root: this.getInitialLayout(params) });
  }

  getLayout(params, routeName) {
    const layout = {
      center: super.getLayout(params, routeName),
      [this.drawerPosition]: this.drawer.getLayout(params),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { sideMenu: layout };
  }
}
