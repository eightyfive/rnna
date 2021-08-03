import { createSelector } from 'reselect';

const hasPaths = paths => paths.length > 0;

export const creating = createSelector(state => state.api.creating, hasPaths);

export const reading = createSelector(state => state.api.reading, hasPaths);

export const updating = createSelector(state => state.api.updating, hasPaths);

export const deleting = createSelector(state => state.api.deleting, hasPaths);

export const fetching = createSelector(
  creating,
  reading,
  updating,
  deleting,
  (c, r, u, d) => c || r || u || d,
);
