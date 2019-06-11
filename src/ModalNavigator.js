import StackNavigator from "./StackNavigator";

export default class ModalNavigator extends StackNavigator {
  mount() {
    this.navigation.showModal(this.getInitialLayout());
  }

  dismiss(fromId) {
    this.navigation.dismissModal(fromId);
  }

  goBack(fromId) {
    try {
      super.goBack(fromId);
    } catch (err) {
      this.dismiss(fromId);
    }
  }
}
