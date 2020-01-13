import Component from './Layout/Component';
import ComponentNavigator from './ComponentNavigator';

let navigator;

const component = new Component('A');
const route = 'main/users/User';

beforeEach(() => {
  navigator = new ComponentNavigator(component);
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
