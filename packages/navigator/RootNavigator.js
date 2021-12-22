import BottomTabsNavigator from './BottomTabsNavigator';
import Emitter from './Emitter';
import ModalNavigator from './ModalNavigator';
import OverlayNavigator from './OverlayNavigator';
import StackNavigator from './StackNavigator';

export default class RootNavigator extends Emitter {
  constructor(navigators) {
    super();

    this.navigators = new Map(Object.entries(navigators));
    this.rootName = null;
    this.modalNames = [];
    this.overlayNames = [];

    this.addListener('ModalDismissed', this.handleModalDismissed);
  }

  get navigator() {
    const modalName = Array.from(this.modalNames).pop();

    if (modalName) {
      return this.getModal(modalName);
    }

    if (this.rootName) {
      return this.getRoot(this.rootName);
    }

    return null;
  }

  handleModalDismissed = ({ componentId: id }) => {
    for (const name of this.modalNames) {
      const modal = this.getModal(name);

      if (modal.id === id) {
        this.modalNames = this.modalNames.filter(n => n !== name);
        break;
      }
    }
  };

  get(name) {
    if (!this.navigators.has(name)) {
      throw new Error(`Navigator not found: ${name}`);
    }

    return this.navigators.get(name);
  }

  getRoot(name) {
    const navigator = this.get(name);

    const isBottomTabs = navigator instanceof BottomTabsNavigator;
    const isStack = navigator instanceof StackNavigator;

    if (!isStack && !isBottomTabs) {
      throw new Error(`Root not found: ${name}`);
    }

    return navigator;
  }

  getModal(name) {
    const navigator = this.get(name);

    const isModal = navigator instanceof ModalNavigator;

    if (!isModal) {
      throw new Error(`Modal not found: ${name}`);
    }

    return navigator;
  }

  getOverlay(name) {
    const navigator = this.get(name);

    const isOverlay = navigator instanceof OverlayNavigator;

    if (!isOverlay) {
      throw new Error(`Overlay not found: ${name}`);
    }

    return navigator;
  }

  getStack() {
    const isStack = this.navigator instanceof StackNavigator;

    if (isStack) {
      return this.navigator;
    }

    const isBottomTabs = this.navigator instanceof BottomTabsNavigator;

    if (isBottomTabs) {
      return this.navigator.getTab();
    }

    throw new Error('Stack not found');
  }

  // Root
  mount(name, props) {
    const root = this.getRoot(name);

    root.mount(props);

    this.rootName = name;
  }

  // Stack
  push(name, props) {
    this.getStack().push(name, props);
  }

  pop() {
    this.getStack().pop();
  }

  popTo(id) {
    this.getStack().popTo(id);
  }

  popToRoot() {
    this.getStack().popToRoot();
  }

  // BottomTabs
  selectTab(index) {
    const isBottomTabs = this.navigator instanceof BottomTabsNavigator;

    if (!isBottomTabs) {
      throw new Error('BottomTabs not found');
    }

    this.navigator.selectTab(index);
  }

  // Modal
  showModal(name, props) {
    const modal = this.getModal(name);

    if (this.modalNames.length) {
      throw new Error('Cannot show more than one Modal at a time');
    }

    modal.show(props);

    this.modalNames.push(name);
  }

  dismissModal(name) {
    const modal = this.getModal(name);

    if (!this.modalNames.includes(name)) {
      throw new Error(`Modal ${name} is not showing`);
    }

    modal.dismiss();

    this.modalNames = this.modalNames.filter(n => n !== name);
  }

  // Overlay
  showOverlay(name, props) {
    const overlay = this.getOverlay(name);

    overlay.show(props);

    this.overlayNames.push(name);
  }

  dismissOverlay(name) {
    const overlay = this.getOverlay(name);

    if (!this.overlayNames.includes(name)) {
      throw new Error(`Overlay ${name} is not showing`);
    }

    overlay.dismiss();

    this.overlayNames = this.overlayNames.filter(n => n === name);
  }
}
