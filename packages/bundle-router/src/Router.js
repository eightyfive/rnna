import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(navigator, routes, options) {
    super(navigator, routes, options);

    this.uris = new Map();

    this.navigator.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    const uri = this.uris.get(componentId);

    this.dispatch(uri);
  };

  dispatch(uri) {
    const res = super.dispatch(uri);

    this.uris.set(res[0], uri);

    return res;
  }
}
