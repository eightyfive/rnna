import { Navigation } from 'react-native-navigation';
import { ComponentLayout } from './ComponentLayout';
import { Props } from './Layout';
import { Navigator } from './Navigator';

export abstract class ComponentNavigator extends Navigator<ComponentLayout> {
  constructor(component: ComponentLayout) {
    super(component);
  }

  mount(props: Props) {
    Navigation.setRoot({
      root: this.layout.getRoot(props),
    });
  }
}
