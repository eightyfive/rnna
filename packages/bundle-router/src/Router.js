import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(navigator, routes, options) {
    super(navigator, routes, options);

    this.uris = new Map();

    this.navigator.addListener('ComponentDidAppear', this.handleDidAppear);

    this.addListener('dispatch', this.handleDispatch);
  }

  handleDidAppear = ({ componentId }) => {
    const uri = this.uris.get(componentId);

    this.render(uri);
  };

  handleDispatch = ({ componentId, uri }) => {
    this.uris.set(componentId, uri);
  };
}
