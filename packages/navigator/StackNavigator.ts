import { Navigation, ScreenPoppedEvent } from 'react-native-navigation';
import { Props } from './Layout';

import { Navigator } from './Navigator';
import { StackLayout } from './StackLayout';

type ScreenPoppedListener = (ev: ScreenPoppedEvent) => void;

export default class StackNavigator extends Navigator<StackLayout> {
  history: string[];

  constructor(stack: StackLayout, config = {}) {
    super(stack, config);

    this.history = [];

    this.onScreenPopped(this.handleScreenPopped);
  }

  onScreenPopped(listener: ScreenPoppedListener) {
    Navigation.events().registerScreenPoppedListener(listener);
  }

  get componentName() {
    return Array.from(this.history).pop() || null;
  }

  get component() {
    if (this.componentName) {
      return this.layout.components.get(this.componentName);
    }

    return null;
  }

  handleScreenPopped = (ev: ScreenPoppedEvent) => {
    try {
      const component = this.layout.getComponentById(ev.componentId);

      if (this.componentName === component.name) {
        this.history.pop();
      }
    } catch (err) {
      // Ignore
    }
  };

  init() {
    this.history = [this.layout.initialName];
  }

  mount(props: Props) {
    Navigation.setRoot({
      root: this.layout.getRoot(props),
    });

    this.init();
  }

  push(name: string, props: Props) {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    const componentTo = this.layout.components.get(name);

    if (!componentTo) {
      throw new Error(`Component not found: ${name}`);
    }

    Navigation.push(this.component.id, componentTo.getRoot(props));

    this.history.push(name);
  }

  pop() {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    Navigation.pop(this.component.id);

    this.history.pop();
  }

  popTo(id: string) {
    if (!this.history.length) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Nothing to pop');
    }

    const component = this.layout.getComponentById(id);

    if (!this.history.includes(component.name)) {
      throw new Error(`Component not in stack: ${component.id}`);
    }

    Navigation.popTo(component.id);

    const index = this.history.indexOf(component.name);

    this.history.splice(index + 1);
  }

  popToRoot() {
    if (!this.component) {
      throw new Error('Stack not mounted');
    }

    if (this.history.length < 2) {
      throw new Error('Already stack root');
    }

    Navigation.popToRoot(this.component.id);

    this.history = [this.layout.initialName];
  }
}
