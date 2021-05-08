import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(root) {
    super(root);

    this.root.addListener('ComponentDidAppear', this.handleDidAppear);
  }

  handleDidAppear = ({ componentId }) => {
    const path = this.paths.get(componentId);

    this.dispatch(path);
  };
}
