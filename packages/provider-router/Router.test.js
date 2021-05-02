import { getRouteDepth } from './factory.native';

function A() {}
function B() {}
function C() {}

const topBar = { title: { text: 'Foo' } };
const bottomTab = { text: 'Tab label' };

const tabs = {
  ab: { A, B, config: { foo: 'bar' } },
  c: { C, options: { topBar } },
  options: { bottomTab },
};

const stack = {
  C,
  options: { topBar },
  config: { mode: 'modal' },
};

test('Depth (stack)', () => {
  expect(getRouteDepth(stack)).toBe(0);
});

test('Depth (tabs)', () => {
  expect(getRouteDepth(tabs)).toBe(1);
});

test('Depth (root)', () => {
  expect(
    getRouteDepth({
      tabs,
      stack,
      C, // Overlay
    }),
  ).toBe(2);
});
