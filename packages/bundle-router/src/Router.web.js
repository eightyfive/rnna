import RouterAbstract from './router-abstract';

export default class Router extends RouterAbstract {
  constructor(navigator, routes, options) {
    super(navigator, routes, options);

    window.addEventListener('popstate', this.handlePopstate.bind(this));
  }

  handlePopstate() {
    const uri = this.getLocationUri();

    this.dispatch(uri);
  }

  dispatch(uri) {
    const redirect = this.options.redirects[uri];
    const redirection = redirect ? redirect(this.services) : undefined;

    if (typeof redirection === 'string') {
      super.dispatch(redirection);

      // Replace
      // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
      window.history.replaceState({}, null, `/${redirection}`);
    } else {
      super.dispatch(uri);

      const location = this.getLocationUri();

      if (uri !== location) {
        // Push
        // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
        window.history.pushState({}, null, `/${uri}`);
      }
    }
  }

  getLocationUri() {
    const { pathname, search = '' } = new URL(document.location);

    return pathname.substring(1) + search;
  }
}
