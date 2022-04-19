import { Options } from 'react-native-navigation';

import { Layout, Props } from './Layouts/Layout';

type ComponentLayoutType = {
  id: string;
  name: string;
  options?: Options;
  passProps?: object;
};

type ComponentOptionsType = object;

export class ComponentLayout extends Layout<
  ComponentLayoutType,
  ComponentOptionsType
> {
  id: string;
  name: string;
  props: Props;

  constructor(id: string, name: string, options: Options = {}) {
    super(options);

    this.id = id;
    this.name = name;
    this.props = {};
  }

  getLayout(props: Props) {
    const layout: ComponentLayoutType = {
      id: this.id,
      name: this.name,
    };

    if (Object.keys(this.options).length > 0) {
      layout.options = { ...this.options };
    }

    if (props) {
      this.props = props;
    }

    if (Object.keys(this.props).length > 0) {
      layout.passProps = { ...this.props };
    }

    return layout;
  }
}
