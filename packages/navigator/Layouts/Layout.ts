export type Props = object;

export abstract class Layout<LayoutType, OptionsType> {
  options: OptionsType | object;

  constructor(options?: OptionsType) {
    this.options = options || {};
  }

  abstract getLayout(props: Props): LayoutType;
}
