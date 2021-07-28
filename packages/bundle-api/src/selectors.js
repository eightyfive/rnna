import { createSelector } from 'reselect';

const hasPaths = paths => paths.length > 0;

export const creating = createSelector(state => state.http.creating, hasPaths);

export const reading = createSelector(state => state.http.reading, hasPaths);

export const updating = createSelector(state => state.http.updating, hasPaths);

export const deleting = createSelector(state => state.http.deleting, hasPaths);

export const fetching = createSelector(
  creating,
  reading,
  updating,
  deleting,
  (c, r, u, d) => c || r || u || d,
);
