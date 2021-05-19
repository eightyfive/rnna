import { Modal, Overlay } from './Layouts';
import SwitchNavigator from './SwitchNavigator';

export default class RootNavigator extends SwitchNavigator {
  constructor(layouts, config = {}) {
    super(layouts, config);

    this.overlays = [];
    this.modalName = null;

    this.addListener('ModalDismissed', this.handleModalDismissed);
  }

  handleModalDismissed = () => {
    if (this.modal) {
      this.modalName = null;
    }
  };

  get modal() {
    if (this.modalName) {
      return this.layouts.get(this.modalName);
    }

    return null;
  }

  addModal(name, modal) {
    if (!(modal instanceof Modal)) {
      throw new TypeError('Invalid argument');
    }

    this.layouts.set(name, modal);

    this.defineProperty(name, modal);
  }

  addOverlay(name, overlay) {
    if (!(overlay instanceof Overlay)) {
      throw new TypeError('Invalid argument');
    }

    this.layouts.set(name, overlay);

    this.defineProperty(name, overlay);
  }

  remount() {
    super.remount();

    this.overlays.forEach(name => this.layouts.get(name).mount());
  }

  render(componentId, props = {}) {
    const [name, childPath] = this.readPath(componentId);

    const layout = this.layouts.get(name);

    if (!layout) {
      throw new Error(`Layout not found: ${name}`);
    }

    Object.assign(props, this.props);

    if (layout instanceof Modal) {
      this.renderModal(name, childPath, props);
    } else if (layout instanceof Overlay) {
      this.renderOverlay(name, props);
    } else {
      if (this.modal) {
        this.dismissModal();
      }

      super.render(componentId, props);
    }
  }

  renderModal(name, componentName, props) {
    if (this.modalName !== name) {
      // One modal at a time
      if (this.modal) {
        this.dismissModal();
      }

      this.modalName = name;

      this.modal.mount(props);
    }

    this.renderStack(this.modal, componentName, props);
  }

  renderOverlay(name, props) {
    const mounted = this.overlays.find(val => val === name);
    const overlay = this.layouts.get(name);

    if (mounted) {
      overlay.update(props);
    } else {
      this.overlays.push(name);

      overlay.mount(props);
    }
  }

  goBack() {
    if (this.modal) {
      try {
        this.goBackStack(this.modal);
      } catch (err) {
        this.dismissModal();
      }
    } else {
      super.goBack();
    }
  }

  dismissModal() {
    this.modal.dismiss();
    this.modalName = null;
  }

  dismissOverlay(name) {
    const overlay = this.layouts.get(name);

    if (!(overlay instanceof Overlay)) {
      throw new Error(`Overlay not found: ${name}`);
    }

    this.overlays = this.overlays.filter(val => val !== name);

    overlay.dismiss();
  }
}
