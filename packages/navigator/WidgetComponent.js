import Component from './Component.native';

export default class WidgetComponent extends Component {
  constructor(id, options) {
    super(`widget-${id}`, options);
  }
}
