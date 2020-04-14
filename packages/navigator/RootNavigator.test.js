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

test('navigate', () => {
  app.get('cd').mount = jest.fn();

  app.navigate('cd');

  expect(app.get('cd').mount).toHaveBeenCalled();
});

test('navigate deep', () => {
  app.get('cd').mount = jest.fn();
  app.get('cd').push = jest.fn();

  app.navigate('cd/D');

  expect(app.get('cd').mount).toHaveBeenCalled();
  expect(app.get('cd').push).toHaveBeenCalledWith('D', undefined, 'ab');
});
