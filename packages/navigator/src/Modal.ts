import {
  ModalOptions as OptionsModal,
  OptionsModalPresentationStyle,
  OptionsModalTransitionStyle,
  Navigation,
  Options,
} from 'react-native-navigation';

import { Props } from './types';
import { Stack } from './Stack';

export type ModalOptions = OptionsModal & {
  transitionStyle?: OptionsModalTransitionStyle;
  presentationStyle?: OptionsModalPresentationStyle;
};

export class Modal extends Stack<ModalOptions> {
  getOptions(options: ModalOptions): Options {
    const { transitionStyle, presentationStyle, ...modal } = options;

    return {
      modal,
      modalTransitionStyle: transitionStyle,
      modalPresentationStyle: presentationStyle,
    };
  }

  mount(props?: Props) {
    this.show(props);
  }

  show(props?: Props) {
    Navigation.showModal(this.getRoot(props));
  }

  dismiss() {
    Navigation.dismissModal(this.id);
  }
}
