import { Navigation, Options } from 'react-native-navigation';
import { Layout } from './Layout';
import type { Props } from './types';

// Layout
export type ComponentLayout = {
  id: string;
  name: string;
  options?: Options;
  passProps?: object;
};

// Options
export type ComponentOptions = Options;

export class Component<OptionsT = ComponentOptions> extends Layout<ComponentLayout, OptionsT> {
  name: string;

  constructor(name: string, options?: OptionsT) {
    super(name, options);
    
    this.name = name;
  }

  getLayout(props?: Props) {
    const layout: ComponentLayout = {
      id: this.id,
      name: this.name,
    };

    if (this.options) {
      layout.options = this.getOptions(this.options);
    }

    if (props) {
      layout.passProps = props;
    }

    return layout;
  }

  getOptions(options: OptionsT): Options {
    return options
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
