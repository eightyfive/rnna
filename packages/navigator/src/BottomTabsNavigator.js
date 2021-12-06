import Navigator from './Navigator';
import BottomTabs from './Layouts/BottomTabs';

export default class BottomTabsNavigator extends Navigator {
  constructor(layout) {
    if (!(layout instanceof BottomTabs)) {
      throw new TypeError('Layout must be bottomTabs');
    }

    super(layout);
  }

  getStack() {
    return this.layout.getTab();
  }
}
