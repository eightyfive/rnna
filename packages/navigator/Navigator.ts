import { Props } from './Layout';

export abstract class Navigator<ILayout, ConfigType = object> {
  layout: ILayout;
  config: ConfigType | object;

  constructor(layout: ILayout, config?: ConfigType) {
    this.layout = layout;
    this.config = config || {};
  }

  abstract mount(props: Props): void;
}
