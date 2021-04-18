import { createSelector as reSelector } from 'reselect';

// getSlice
function getSlice(path) {
  const { slices } = cache;

  if (!slices.has(path)) {
    slices.set(path, st => _get(st, path));
  }

  return slices.get(path);
}

// createSelector
export function createSelector(...names) {
  const selector = names.pop();

  const slices = names.map(name =>
    typeof name === 'string' || Array.isArray(name) ? getSlice(name) : name,
  );

  if (!slices.length) {
    return reSelector(getSlice(selector), s => s);
  }

  return reSelector(...slices, selector);
}

const db = {};

export default db;
