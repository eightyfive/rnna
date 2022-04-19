import { Component } from './Component';

export class Widget extends Component {
  constructor(name: string, options = {}) {
    super(`widget-${name}`, name, options);
  }
}
