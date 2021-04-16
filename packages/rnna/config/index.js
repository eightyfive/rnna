import _mergeWith from 'lodash.mergewith';

export function merge(config, source) {
  return _mergeWith(config, source, (a, b) => {
    if (Array.isArray(a)) {
      return b.concat(a);
    }
  });
}
