import Navigator from './Navigator';

let navigator;

const path = 'main/users/User';

beforeEach(() => {
  navigator = new Navigator({}, {});
});

test('getPathSegments', () => {
  expect(navigator.getPathSegments(path)).toEqual(['main', 'users', 'User']);
});

test('getPathNavigator', () => {
  expect(navigator.getPathNavigator(path)).toBe('main');
});

test('getNextPath', () => {
  expect(navigator.getNextPath(path)).toBe('users/User');
});

test('getPathComponentId', () => {
  expect(navigator.getPathComponentId(path)).toBe('User');
});
