import { Navigation, Options } from 'react-native-navigation';
import shallowEqual from 'shallowequal';

import { Layout, LayoutType, Props } from './Layout';

type ComponentLayout = LayoutType;

type ComponentRoot = { component: ComponentLayout };

export class Component extends Layout<ComponentRoot> {
  id: string;
  name: string;
  options: Options;
  props: Props;

  constructor(id: string, name: string, options: Options = {}) {
    super();

    this.id = id;
    this.name = name;
    this.options = options || {};
    this.props = {};
  }

  getRoot(props: Props) {
    const layout: ComponentLayout = {
      id: this.id,
      name: this.name,
      options: { ...this.options },
    };

    if (props) {
      this.props = props;
    }

    layout.passProps = { ...this.props };

    return { component: layout };
  }

  update(props: Props) {
    if (!shallowEqual(props, this.props)) {
      this.props = props;

      Navigation.updateProps(this.id, props);
    }
  }
}
