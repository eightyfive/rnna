import { Component, Stack, BottomTabs } from './Layouts';
import RootRouter from './RootRouter';

const A = new Component('A', 'A', { topBar: { title: { text: 'Title A' } } });
const B = new Component('B', 'B', { topBar: { title: { text: 'Title B' } } });
const C = new Component('C', 'C', { topBar: { title: { text: 'Title C' } } });
const D = new Component('D', 'D', { topBar: { title: { text: 'Title D' } } });
const E = new Component('E', 'E', { topBar: { title: { text: 'Title E' } } });
const F = new Component('F', 'F', { topBar: { title: { text: 'Title F' } } });

let app;
let abcdMount;
let efMount;

beforeEach(() => {
  jest.clearAllMocks();

  const ab = new Stack({ A, B });
  const cd = new Stack({ C, D });
  const abcd = new BottomTabs({ ab, cd });
  const ef = new Stack({ E, F });

  app = new RootRouter({ abcd, ef });

  abcdMount = jest.spyOn(app.abcd, 'mount');
  app.abcd.cd.push = jest.fn();

  efMount = jest.spyOn(app.ef, 'mount');
  app.ef.push = jest.fn();
});

test('mount', () => {
  app.render('abcd');

  expect(abcdMount).toHaveBeenCalled();
  expect(app.ef.mount).not.toHaveBeenCalled();
});

test('render', () => {
  app.render('ef/F');

  expect(efMount).toHaveBeenCalled();
  expect(app.ef.push).toHaveBeenCalledWith('F', undefined);
});

test('render deep', () => {
  app.render('abcd/cd/D');

  expect(abcdMount).toHaveBeenCalled();
  expect(app.abcd.cd.push).toHaveBeenCalledWith('D', undefined);
});
