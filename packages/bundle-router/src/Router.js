import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(layouts, config) {
    super(layouts, config);

    this.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    const path = this.paths.get(componentId);

    this.dispatch(path);
  };
}
