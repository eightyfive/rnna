import Component from './Component';
import { createBottomTabs, createModal, createStack } from './index.native';

import RootNavigator from './RootNavigator';

const A = new Component('A', 'A');
const B = new Component('B', 'B');
const C = new Component('C', 'C');
const D = new Component('D', 'D');
const E = new Component('E', 'E');
const F = new Component('F', 'F');

let app;
let abcdMount;
let efMount;

beforeEach(() => {
  jest.clearAllMocks();

  app = new RootNavigator();

  const abcd = createBottomTabs({
    ab: { A, B },
    cd: { C, D },
  });
  app.addRoute('abcd', abcd);

  const ef = createStack({ E, F });
  app.addRoute('ef', ef);

  abcdMount = jest.spyOn(app.getRoute('abcd'), 'mount');
  app.getRoute('abcd').getRoute('cd').push = jest.fn();

  efMount = jest.spyOn(app.getRoute('ef'), 'mount');
  app.getRoute('ef').push = jest.fn();

  app.mount();
});

test('mount', () => {
  expect(abcdMount).toHaveBeenCalled();
  expect(app.getRoute('ef').mount).not.toHaveBeenCalled();
});

test('render', () => {
  app.render('ef/F');

  expect(efMount).toHaveBeenCalled();
  expect(app.getRoute('ef').push).toHaveBeenCalledWith('F', undefined);
});

test('render deep', () => {
  app.render('abcd/cd/D');

  expect(abcdMount).toHaveBeenCalled();
  expect(app.getRoute('abcd').getRoute('cd').push).toHaveBeenCalledWith(
    'D',
    undefined,
  );
});
