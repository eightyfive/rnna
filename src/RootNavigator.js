import { Navigation } from 'react-native-navigation';

import Navigator from './Navigator';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';

export default class RootNavigator extends Navigator {
  constructor(navigators, options = {}) {
    super(options.name || 'Root');

    this.navigators = navigators;

    this.mounted = [];
    this.overlays = [];

    this.fromId = options.initialComponentId || 'Splash';

    this.onTabSelected = [];

    const events = Navigation.events();

    this.appLaunchedListener = events.registerAppLaunchedListener(
      this.handleAppLaunched,
    );

    this.didAppearListener = events.registerComponentDidAppearListener(
      this.handleDidAppear,
    );

    this.modalDismissedListener = events.registerModalDismissedListener(
      this.handleModalDismissed,
    );

    this.tabSelectedListener = events.registerBottomTabSelectedListener(
      this.handleBottomTabSelected,
    );
  }

  handleAppLaunched = () => {
    this.mount();

    this.overlays.forEach(overlay => overlay.mount());
  };

  handleDidAppear = ({ componentId }) => {
    if (isScene(componentId)) {
      this.fromId = componentId;

      // console.log('did APPEAR:', componentId);
    }
  };

  handleModalDismissed = ({ componentId, modalsDismissed }) => {
    // console.log('modal Dismissed:', componentId, modalsDismissed);

    // Happens when Native back button is pressed.
    // We need to remove/"pop" the top-most modal
    this.mounted = this.mounted.filter(
      // navigator instanceof ModalNavigator
      navigator => navigator.name !== componentId,
    );
  };

  handleBottomTabSelected = ev => {
    return Promise.all(this.onTabSelected.map(handler => handler(ev)));
  };

  onBottomTabSelected(cb) {
    this.onTabSelected.push(cb);
  }

  run() {
    // FIXME
    // App launches itself in `handleAppLaunched`
  }

  get active() {
    return this.mounted[this.mounted.length - 1];
  }

  isActive(name) {
    return Boolean(this.active && this.active.name === name);
  }

  mount() {
    if (this.mounted.length) {
      this.mounted.forEach(navigator => navigator.mount());
    } else {
      const { name } = this.navigators[0];

      this.navigate(name);
    }
  }

  getNavigator(name) {
    return this.navigators.find(nav => nav.name === name);
  }

  navigate(path, params) {
    const [name, rest] = this.splitPath(path);
    const navigator = this.getNavigator(name);

    if (!navigator) {
      throw new Error(`Unknown navigator: ${navigator} (${path})`);
    }

    if (!this.isActive(name)) {
      navigator.mount();

      this.mounted.push(navigator);
    }

    if (rest) {
      navigator.navigate(rest, params, this.fromId);
    }
  }

  goBack() {
    try {
      this.active.goBack(this.fromId);
    } catch (err) {
      if (this.active instanceof ModalNavigator) {
        this.active.unmount(this.fromId);
        this.mounted.pop();
      }
    }
  }

  push(name, params) {
    if (!this.active.push) {
      throwNotSupported(this.active, 'push');
    }

    this.active.push(name, params, this.fromId);
  }

  pop(n = 1) {
    if (!this.active.pop) {
      throwNotSupported(this.active, 'pop');
    }

    this.active.pop(n);
  }

  popToTop() {
    if (!this.active.popToTop) {
      throwNotSupported(this.active, 'popToTop');
    }

    this.active.popToTop(this.fromId);
  }

  dismiss() {
    if (!this.active.dismiss) {
      throwNotSupported(this.active, 'dismiss');
    }

    this.active.dismiss(this.fromId);
  }

  dismissAllModals() {
    this.mounted = this.mounted.filter(
      navigator => !(navigator instanceof ModalNavigator),
    );
    Navigation.dismissAllModals();
  }

  dismissAllOverlays() {
    this.overlays.forEach(overlay => overlay.unmount());
    this.overlays = [];
  }

  isComponentId(id) {
    return this.fromId === id;
  }

  showOverlay(name) {
    const overlay = this.getNavigator(name);

    if (!overlay || !(overlay instanceof OverlayNavigator)) {
      throw new Error(`Unknown Overlay: ${name}`);
    }

    overlay.mount();

    this.overlays.push(overlay);
  }

  hideOverlay(name) {
    const index = this.overlays.findIndex(ov => ov.name === name);
    const visible = index !== -1;

    if (visible) {
      const [overlay] = this.overlays.splice(index, 1);

      overlay.unmount();
    } else if (__DEV__) {
      console.warn(`Cannot hide overlay. Overlay "${name}" is not visible`);
    }
  }

  // FIXME: Ugly, remove
  setTitle(text) {
    Navigation.mergeOptions(this.fromId, {
      topBar: { title: { text } },
    });
  }
}

function isScene(componentId) {
  const isWidget = componentId.indexOf('widget-') === 0;
  const isOverlay = componentId.indexOf('overlay-') === 0;

  return !isWidget && !isOverlay;
}

function throwNotSupported(navigator, method) {
  if (__DEV__) {
    throw new Error(
      `${navigator.constructor.name} does not support \`${method}\``,
    );
  }
}
