import RouterBase from './router';

export default class Router extends RouterBase {
  constructor(navigator, routes, options) {
    super(navigator, routes, options);

    this.options.redirects = (options || {}).redirects || {};

    window.addEventListener('popstate', this.handlePopstate.bind(this));
  }

  handlePopstate() {
    const uri = this.getLocationUri();

    this.dispatch(uri);
  }

  dispatch(uri) {
    const [path] = uri.split('?');

    const redirect = this.options.redirects[path];
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
