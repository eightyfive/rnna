import { getRouteType, getObjDepth } from './utils';

function A() {}
function B() {}
function C() {}
function D() {}

// Layout types
test('Detect bottomTabs', () => {
  expect(
    getRouteType({
      ab: { A, B },
      cd: { C, D, config: { options: {} } },
    }),
  ).toBe('bottomTabs');
});

test('Detect stack', () => {
  expect(getRouteType({ A, B })).toBe('stack');
  expect(getRouteType({ A, B, config: { options: {} } })).toBe('stack');
});

test('Detect modal', () => {
  expect(getRouteType({ A, B, config: { mode: 'modal' } })).toBe('modal');
});

test('Detect overlay', () => {
  expect(getRouteType(A)).toBe('overlay');
});

test('Detect null (too deep)', () => {
  expect(
    getRouteType({
      // 1
      a: {
        // 2
        b: {
          // 3
          c: {
            // 4
            D: 'D',
          },
        },
      },
    }),
  ).toBe(null);
});

test('Obj depth', () => {
  expect(getObjDepth('A')).toBe(0);
  expect(getObjDepth({ level1: 'A' })).toBe(1);
  expect(
    getObjDepth({
      level11: { A: 'A', B: 'B' },
      level12: { C: 'C' },
    }),
  ).toBe(2);
  expect(
    getObjDepth({
      // 1
      level21: {
        // 2
        level32: {
          // 3
          C: 'C',
          D: 'D',
        },
        // 2
        level31: {
          // 3
          E: 'E',
          F: 'F',
          config: {
            // 4
            options: {
              // 5
            },
          },
        },
      },
      level22: {
        // 2
        level33: {
          // 3
          E: 'E',
          F: 'F',
        },
      },
    }),
  ).toBe(5);
});
