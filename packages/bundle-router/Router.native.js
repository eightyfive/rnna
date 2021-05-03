import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(routes, components, services = {}) {
    super(routes, components, services);

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    const path = this.paths.get(componentId);

    this.render(path);
  };

  onState() {
    this.render(this.path);
  }
}
