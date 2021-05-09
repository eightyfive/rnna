import createRouter from './factory';
import Router from './Router';

function A() {}
function B() {}

test('createRouter', () => {
  const router = createRouter({ ab: { A, B } });

  expect(router).toBeInstanceOf(Router);
});
