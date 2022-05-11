import { Navigation, Options } from 'react-native-navigation';
import { Layout } from './Layout';
import { registerComponent } from './registerComponent';
import type { ComponentLayout, Props, ReactComponent, ScreenElement } from './types';

export class Component extends Layout<ComponentLayout> {
  name: string;
  ScreenComponent: ScreenElement;

  constructor(name: string, ScreenComponent: ScreenElement, options?: Options) {
    super(options);

    this.name = name;
    this.ScreenComponent = ScreenComponent;
  }

  getLayout(props?: Props) {
    const layout: ComponentLayout = {
      id: this.id,
      name: this.name,
    };

    if (this.options) {
      layout.options = { ...this.options };
    }

    if (props) {
      layout.passProps = { ...props };
    }

    return layout;
  }

  getRoot(props?: Props) {
    return {
      component: this.getLayout(props),
    };
  }

  mount(props?: Props) {
    Navigation.setRoot({
      root: this.getRoot(props),
    });
  }

  register(Provider?: ReactComponent) {
    registerComponent(this.name, this.ScreenComponent, Provider);
  }
}
