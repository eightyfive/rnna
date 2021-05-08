import { Modal, Overlay } from './Layouts';
import SwitchRouter from './SwitchRouter';

export default class RootRouter extends SwitchRouter {
  constructor(layouts, config = {}) {
    super(layouts, config);

    this.overlays = [];

    this.addListener('ModalDismissed', this.handleModalDismissed);
  }

  handleModalDismissed = () => {
    const layout = this.layouts.get(this.name);

    if (layout instanceof Modal) {
      this.history.pop();
    }
  };

  addModal(name, modal) {
    if (!(modal instanceof Modal)) {
      throw new TypeError('Invalid argument');
    }

    this.layouts.set(name, modal);
  }

  addOverlay(name, overlay) {
    if (!(overlay instanceof Overlay)) {
      throw new TypeError('Invalid argument');
    }

    this.layouts.set(name, overlay);
  }

  remount() {
    super.remount();

    this.overlays.forEach(name => this.layouts.get(name).mount());
  }

  render(componentId, props) {
    const [name, childName] = this.readPath(componentId);

    const layout = this.layouts.get(name);

    if (layout instanceof Modal) {
      this.renderModal(name, childName, props);
    } else if (layout instanceof Overlay) {
      this.renderOverlay(name, props);
    } else {
      if (this.hasModal()) {
        this.dismissModal();
      }

      super.render(componentId, props);
    }
  }

  renderModal(name, componentName, props) {
    let modal = this.layouts.get(name);

    if (this.name !== name) {
      // One modal at a time
      if (this.hasModal()) {
        this.dismissModal();
      }

      this.history.push(name);

      modal = this.layouts.get(this.name);
      modal.mount(props);
    }

    super.renderStack(modal, componentName, props);
  }

  renderOverlay(name, props) {
    const found = this.overlays.find(val => val === name);
    const overlay = this.layouts.get(name);

    if (found) {
      overlay.update(props);
    } else {
      this.overlays.push(name);

      overlay.mount(props);
    }
  }

  goBack() {
    const layout = this.layouts.get(this.name);

    if (layout instanceof Modal) {
      try {
        this.goBackStack(layout);
      } catch (err) {
        this.dismissModal();
      }
    } else {
      super.goBack();
    }
  }

  hasModal() {
    const layout = this.layouts.get(this.name);

    return layout instanceof Modal;
  }

  dismissModal() {
    const layout = this.layouts.get(this.name);

    if (!(layout instanceof Modal)) {
      throw new Error('No modal to dismiss');
    }

    layout.dismiss();

    this.history.pop();
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
