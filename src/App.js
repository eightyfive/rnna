import { BackHandler } from "react-native";

export default class App {
  constructor(navigation, navigator, options = {}) {
    this.navigation = navigation;
    this.navigator = navigator;
    this.overlays = options.overlays || [];

    this.history = [options.initialComponentId || "Splash"];
    this.onTabSelected = [];

    this.ready = new Promise(resolve =>
      this.navigation.events().registerAppLaunchedListener(resolve)
    );

    const events = this.navigation.events();

    this.didAppearListener = events.registerComponentDidAppearListener(
      this.handleDidAppear
    );

    this.modalListener = events.registerModalDismissedListener(
      this.handleModalDismissed
    );

    this.tabSelectedListener = events.registerBottomTabSelectedListener(
      this.handleBottomTabSelected
    );

    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleHardwareBackPress
    );
  }

  handleHardwareBackPress = () => {
    this.goBack();

    return true;
  };

  handleDidAppear = ({ componentName, componentId }) => {
    const isWidget = componentName.indexOf("widget-") === 0;
    const isOverlay = componentName.indexOf("overlay-") === 0;

    if (!isWidget && !isOverlay) {
      this.history.push(componentId);
    }
  };

  handleModalDismissed = ({ componentId /* , modalsDismissed */ }) => {
    if (this.isActive(componentId)) {
      this.history.pop();
    }
  };

  handleBottomTabSelected = ev => {
    return Promise.all(this.onTabSelected.map(handler => handler(ev)));
  };

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  run() {
    this.ready.then(() => this.navigator.mount());
  }

  navigate(path, params) {
    this.navigator.navigate(path, params, this.getActiveId());
  }

  goBack() {
    this.navigator.goBack(this.getActiveId());
  }

  push(name, params) {
    const isNavigator = this.navigator instanceof Navigator;

    if (!isNavigator || !this.navigator.push) {
      throwNotSupported(this.navigator, "push");
    }

    this.navigator.push(name, params, this.getActiveId());
  }

  pop(n = 1) {
    const isNavigator = this.navigator instanceof Navigator;

    if (!isNavigator || !this.navigator.pop) {
      throwNotSupported(this.navigator, "pop");
    }

    this.navigator.pop(n);
  }

  popToTop() {
    const isNavigator = this.navigator instanceof Navigator;

    if (!isNavigator || !this.navigator.popToTop) {
      throwNotSupported(this.navigator, "popToTop");
    }

    this.navigator.popToTop(this.getActiveId());
  }

  dismiss() {
    const isNavigator = this.navigator instanceof Navigator;

    if (!isNavigator || !this.navigator.dismiss) {
      throwNotSupported(this.navigator, "dismiss");
    }

    this.navigator.dismiss(this.getActiveId());
  }

  setTitle(text) {
    this.navigation.mergeOptions(this.getActiveId(), {
      topBar: { title: { text } }
    });
  }

  getActiveId() {
    return this.history[this.history.length - 1];
  }

  isActive(componentId) {
    return this.getActiveId() === componentId;
  }

  getOverlay(name) {
    const overlay = this.overlays.find(
      component => component.getShortName() === name
    );

    if (!overlay) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    return overlay;
  }

  showOverlay(name) {
    const overlay = this.getOverlay(name);

    this.navigation.showOverlay(overlay.getLayout());
  }

  hideOverlay(name) {
    const overlay = this.getOverlay(name);

    this.navigation.dismissOverlay(overlay.name);
  }
}

function throwNotSupported(navigator, api) {
  throw new Error(`${navigator.constructor.name} does not support \`${api}\``);
}
