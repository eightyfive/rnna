import { createRootNavigator } from './index';

let app;

const A = {};
const B = {};
const C = {};
const D = {};

beforeEach(() => {
  app = createRootNavigator({
    ab: { A, B },
    cd: { C, D },
  });

  app.mount();
});

test('mount', () => {
  app.get('ab').mount = jest.fn();

  expect(app.get('ab').mount).not.toHaveBeenCalled();
});

test('go', () => {
  app.get('cd').mount = jest.fn();

  app.go('cd');

  expect(app.get('cd').mount).toHaveBeenCalled();
});

test('go deep', () => {
  app.get('cd').mount = jest.fn();
  app.get('cd').push = jest.fn();

  app.go('cd/D');

  expect(app.get('cd').mount).toHaveBeenCalled();
  expect(app.get('cd').push).toHaveBeenCalledWith('D', undefined, 'ab');
});
