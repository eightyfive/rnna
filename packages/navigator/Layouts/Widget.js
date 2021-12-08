import Component from './Component';

export default class Widget extends Component {
  constructor(name, ReactComponent, options = {}) {
    super(`widget-${name}`, name, ReactComponent, options);
  }
}
