import Component from './Component.native';

export default class WidgetComponent extends Component {
  constructor(id, name, options = {}) {
    super(`widget-${id}`, name, options);
  }
}
