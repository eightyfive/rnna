import { Navigation, Options } from 'react-native-navigation';
import { Layout, Props } from './Layout';
import type { ComponentLayout } from './types';

export class Component extends Layout<ComponentLayout> {
  name: string;

  constructor(id: string, name: string, options?: Options) {
    super(id, options);

    this.name = name;
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
}
