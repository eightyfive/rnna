import { Options } from 'react-native-navigation';
import { Component } from './Component';

export class Widget extends Component {
  constructor(name: string, options?: Options) {
    super(`widget-${name}`, name, options);
  }
}
