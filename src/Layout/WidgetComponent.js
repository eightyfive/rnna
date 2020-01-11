import Component from './Component';

export default class WidgetComponent extends Component {
  constructor(id, options) {
    super(`widget-${id}`, options);
  }
}
