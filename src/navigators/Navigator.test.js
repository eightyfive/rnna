import Component from './Component';

let navigator;

const route = 'main/users/User';

beforeEach(() => {
  navigator = new Component('A');
});

test('getRouteSegments', () => {
  expect(navigator.getRouteSegments(route)).toEqual(['main', 'users', 'User']);
});

test('getRouteNavigator', () => {
  expect(navigator.getRouteNavigator(route)).toBe('main');
});

test('getRouteNext', () => {
  expect(navigator.getRouteNext(route)).toBe('users/User');
});

test('getRouteComponentId', () => {
  expect(navigator.getRouteComponentId(route)).toBe('User');
});
