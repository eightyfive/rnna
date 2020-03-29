import _get from 'lodash.get';
import { createSelector as create } from 'reselect';

const cache = {};

export function getSlice(name) {
  if (!cache[name]) {
    cache[name] = state => _get(state, name);
  }

  return cache[name];
}

export function createSelector(...names) {
  const selector = names.pop();
  const original = names.some(name => typeof name !== 'string');

  if (original) {
    return create(...names, selector);
  }

  const slices = names.map(name => getSlice(name));

  return create(...slices, selector);
}

function getResult(byId, result) {
  if (Array.isArray(result)) {
    return result.map(id => byId[id]);
  }

  return byId[result] || null;
}

export function createResultSelector(slice1, slice2) {
  return createSelector(slice1, slice2, getResult);
}

export function createRelationSelector(find, related, foreign) {
  return create(find, getSlice(related), (entity, byId) =>
    getResult(byId, _get(entity, foreign)),
  );
}
