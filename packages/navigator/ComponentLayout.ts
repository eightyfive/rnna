import { Options } from 'react-native-navigation';

import { Layout, Props } from './Layout';

export type ComponentLayoutType = {
  id: string;
  name: string;
  options?: Options;
  passProps?: object;
};

export class ComponentLayout extends Layout<ComponentLayoutType, 'component'> {
  id: string;
  name: string;
  props: Props;

  constructor(id: string, name: string, options: Options = {}) {
    super(options);

    this.id = id;
    this.name = name;
    this.props = {};
  }

  hasProps() {
    return Object.keys(this.props).length > 0;
  }

  getLayout(props: Props) {
    const layout: ComponentLayoutType = {
      id: this.id,
      name: this.name,
    };

    if (this.hasOptions()) {
      layout.options = { ...this.options };
    }

    if (props) {
      this.props = props;
    }

    if (this.hasProps()) {
      layout.passProps = { ...this.props };
    }

    return layout;
  }

  getRoot(props: Props) {
    return {
      component: this.getLayout(props),
    };
  }
}
