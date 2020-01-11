import Component from './Component';

export default class OverlayComponent extends Component {
  constructor(id, options) {
    super(`overlay-${id}`, options);
  }
}
