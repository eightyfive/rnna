import RouterBase from './RouterBase';

export default class Router extends RouterBase {
  constructor(navigator, routes) {
    super(navigator, routes);

    window.addEventListener('popstate', () => this.handlePopstate());
  }

  getURI() {
    const { pathname, search = '' } = new URL(document.location);

    return pathname.substring(1) + search;
  }

  handlePopstate() {
    const uri = this.getURI();

    this.dispatch(uri);
  }

  dispatch(uri) {
    const res = super.dispatch(uri);

    const current = this.getURI();

    if (current !== uri) {
      // console.log('pushState', current, uri);

      window.history.pushState({}, null, `/${uri}`);
    }

    return res;
  }
}
