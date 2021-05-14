import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(navigator, routes, services) {
    super(navigator, routes, services);

    this.uris = new Map();

    this.navigator.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    const uri = this.uris.get(componentId);

    this.dispatch(uri);
  };

  dispatch(uri) {
    const componentId = super.dispatch(uri);

    this.uris.set(componentId, uri);

    return componentId;
  }
}
