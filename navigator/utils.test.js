import { Navigation } from 'react-native-navigation';

import { getRouteDepth } from './utils';

const A = {};
const B = { b1: true, topBar: {} };
const C = {};

test('Route depth', () => {
  expect(
    getRouteDepth({ tabs: { ab: { A, B }, c: { C } }, stack: { C } }),
  ).toBe(3);
});
