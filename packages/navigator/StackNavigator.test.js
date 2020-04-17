import Component from './wix/Component';
import StackNavigator from './StackNavigator';

let app;

const A = new Component('A');
const B = new Component('B');
const C = new Component('C');

const params = { foo: 'bar' };

beforeEach(() => {
  app = new StackNavigator({ A, B, C });

  app.mount();
});

test('pop 1', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.pop(1);

  expect(app.history).toEqual(['A', 'B']);
});

test('pop 2', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.pop(2);

  expect(app.history).toEqual(['A']);
});

test('popToTop', () => {
  app.push('B', params, 'A');
  app.push('C', params, 'B');
  app.popToTop('C');

  expect(app.history).toEqual(['A']);
});

test('goBack', () => {
  app.navigate('B', params, 'A');
  app.navigate('C', params, 'B');
  app.goBack('C');

  expect(app.history).toEqual(['A', 'B']);
});
