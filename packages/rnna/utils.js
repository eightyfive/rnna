const o = Object;

// Credits: https://stackoverflow.com/a/21553982/925307
const reURL = /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/;

export function interpolate(template, data) {
  return o.entries(data || {}).reduce(
    (acc, [key, val]) =>
      acc
        // :name
        .replace(`:${key}`, val)
        // :NAME
        .replace(`:${key.toUpperCase()}`, val.toUpperCase())
        // :Name
        .replace(
          `:${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          val.charAt(0).toUpperCase() + val.slice(1),
        ),
    template,
  );
}

export function parseUrl(href) {
  const match = href.match(reURL);

  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

const isApiType = /^\[API\] (GET|SEARCH|POST|PUT|PATCH|DELETE) (\/[^\s]+) (\d{3})$/;

function parseApi(type) {
  const [, method, url, status] = isApiType.exec(type) || [];

  if (status) {
    return [method, url, parseInt(status, 10)];
  }

  return [];
}

export const actions = {
  isApi(type, verb, pattern, code) {
    const [method, url, status] = parseApi(type);

    if (method && url && status) {
      const regExp = new RegExp(`^${pattern.replace('{id}', '\\d+')}$`);

      const isUrl = regExp.test(url);
      const isStatus = code === status;
      const isMethod = verb === method;

      return isUrl && isStatus && isMethod;
    }

    return false;
  },

  isHTTPVerb(type, ...verbs) {
    const [method, url, status] = parseApi(type);

    if (method && url && status) {
      return verbs.some(verb => verb === method);
    }

    return false;
  },

  isHTTPCode(type, ...codes) {
    const [method, url, status] = parseApi(type);

    if (method && url && status) {
      return codes.some(code => code === status);
    }

    return false;
  },

  isHTTPError(type, code = 400) {
    const [method, url, status] = parseApi(type);

    if (method && url && status) {
      return status >= code;
    }

    return false;
  },
};
