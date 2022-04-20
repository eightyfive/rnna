export default class RootNavigator {
  constructor(navigators) {
    super();

    for (const [name, navigator] of Object.entries(navigators)) {
      Object.assign(this, { [name]: navigator });
    }
  }
}
