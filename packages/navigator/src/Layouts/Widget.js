import Component from './Component';

export default class Widget extends Component {
  constructor(name, options = {}) {
    super(`widget-${name}`, name, options);
  }
}
