import _set from 'lodash/set';

export class Component {
  constructor(id, options) {
    this.id = id;
    this.name = id;
    this.options = options;
  }

  getLayout(passProps = null) {
    // https://wix.github.io/react-native-navigation/#/docs/layout-types?id=component
    const layout = {
      id: this.id,
      name: this.name,
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    if (passProps) {
      layout.passProps = passProps;
    }

    return { component: layout };
  }
}

export class Stack {
  constructor(id, children, options) {
    this.id = id;
    this.name = id;

    this.children = children;
    this.options = options;

    const invalid = children.some(child => !(child instanceof Component));

    if (invalid) {
      throw new Error('Stack: All children must be `Component`');
    }
  }

  getInitialLayout() {
    const [component] = this.children;

    return this.getLayout(component.id);
  }

  getLayout(componentId = null) {
    let { children } = this;

    if (componentId) {
      const index = this.getOrder().findIndex(id => id === componentId);

      if (index === -1) {
        throw new Error(`Stack: Unknown child component: ${componentId}`);
      }

      children = children.slice(0, index + 1);
    }

    // https://wix.github.io/react-native-navigation/#/docs/layout-types?id=stack
    const layout = {
      id: this.id,
      name: this.name,
      children: children.map(child => child.getLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { stack: layout };
  }

  getChild(componentId) {
    return this.children.find(component => component.id === componentId);
  }

  getOrder() {
    return this.children.map(component => component.id);
  }
}

// TODORNNN
export class BottomTabs {
  constructor(id, children, options) {
    this.id = id;
    this.name = id;
    this.children = children;
    this.options = options;

    const invalid = children.some(
      child => !(child instanceof Stack) && !(child instanceof Component),
    );

    if (invalid) {
      throw new Error(
        'BottomTabs: All children must be either `Stack` or `Component`',
      );
    }
  }

  getTab(tabId) {
    return this.children.find(component => component.id === tabId);
  }

  getLayout() {
    // https://wix.github.io/react-native-navigation/#/docs/layout-types?id=bottomtabs
    const layout = {
      id: this.id,
      name: this.name,
      children: this.children.map(child => child.getInitialLayout()),
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    return { bottomTabs: layout };
  }

  getOrder() {
    return this.children.map(component => component.id);
  }
}

export class SideMenu {
  constructor(menu, center, config = {}) {
    this.menu = menu;
    this.center = center;
    this.side = config.side || 'left';

    if (!(menu instanceof Component)) {
      throw new Error('SideMenu: Left/Right must be `Component`');
    }

    if (!(center instanceof Stack)) {
      throw new Error('SideMenu: Center must be `Stack`');
    }
  }

  getLayout(componentId = null) {
    // https://wix.github.io/react-native-navigation/#/docs/layout-types?id=sidemenu
    const layout = {
      center: this.center.getLayout(componentId),
      [this.side]: this.menu.getLayout(),
    };

    return { sideMenu: layout };
  }

  getVisibleLayout(visible) {
    const layout = {
      [this.side]: { visible },
    };

    return { sideMenu: layout };
  }
}

export class OverlayComponent extends Component {
  constructor(id, options) {
    super(`overlay-${id}`, options);
  }
}

export class WidgetComponent extends Component {
  constructor(id, options) {
    super(`widget-${id}`, options);
  }
}

export function getNavigationOptions(nav) {
  const options = {};

  if (!nav) {
    return options;
  }

  if (nav.header === null) {
    _set(options, 'topBar.visible', false);
    _set(options, 'topBar.drawBehind', true);
  } else {
    if (nav.title) {
      _set(options, 'topBar.title.text', nav.title);
    }

    if (nav.headerTintColor) {
      _set(options, 'topBar.title.color', nav.headerTintColor);
    }

    let style;

    style = nav.headerStyle;
    if (style && style.backgroundColor) {
      _set(options, 'topBar.background.color', style.backgroundColor);
    }

    style = nav.headerBackTitleStyle;
    if (style && style.color) {
      _set(options, 'topBar.backButton.color', style.color);
    }
  }

  return options;
}
