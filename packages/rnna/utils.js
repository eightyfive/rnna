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
        .replace(`:${key.toUpperCase()}`, String(val).toUpperCase())
        // :Name
        .replace(
          `:${key.charAt(0).toUpperCase()}${key.slice(1)}`,
          String(val)
            .charAt(0)
            .toUpperCase() + String(val).slice(1),
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

  isHTTP(type, code, verb) {
    const codes = Array.isArray(code) ? code : [code];
    const verbs = Array.isArray(verb) ? verb : [verb];

    const [method, url, status] = parseApi(type);

    if (method && url && status) {
      const isCode = codes.some(c => c === status);
      const isVerb = verb ? verbs.some(v => v === method) : true;

      return isCode && isVerb;
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
