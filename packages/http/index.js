import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export default class Http {
  constructor(defaults = {}) {
    this.defaults = defaults;

    this.stack = req$ => req$.pipe(switchMap(req => ajax(req)));
  }

  create(defaults) {
    return new Http(defaults);
  }

  use(layer) {
    this.stack = layer(this.stack);
  }

  run(req) {
    return this.stack(of(req));
  }

  setHeader(name, value) {
    Object.assign(this.defaults.headers, { [name]: value });
  }

  setBearer(token) {
    this.setHeader('Authorization', `Bearer ${token}`);
  }

  get(path, options) {
    return this.request('GET', path, undefined, options);
  }

  post(path, data, options) {
    return this.request('POST', path, data, options);
  }

  put(path, data, options) {
    return this.request('PUT', path, data, options);
  }

  patch(path, data, options) {
    return this.request('PATCH', path, data, options);
  }

  delete(path, options) {
    return this.request('DELETE', path, undefined, options);
  }

  search(path, query, options) {
    return this.request(
      'GET',
      `${path}?${this.queryString(query)}`,
      undefined,
      options,
    );
  }

  queryString(obj) {
    return Object.entries(obj)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
      )
      .join('&');
  }

  request(method, path, data, options = {}) {
    // Headers
    const headers = Object.assign({}, this.defaults.headers, options.headers);

    if (data instanceof FormData) {
      delete headers['Content-Type'];
    }

    // URL
    let url;

    if (this.defaults.url) {
      url = `${this.defaults.url}/${path}`;
    } else {
      url = path;
    }

    // Request
    // https://github.com/ReactiveX/rxjs/blob/6.5.5/src/internal/observable/dom/AjaxObservable.ts#L7
    const req = {
      url,
      method,
      headers,
    };

    if (data) {
      req.body = data;
    }

    return this.run(req);
  }
}
