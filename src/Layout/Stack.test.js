import Component from './Component';
import Stack from './Stack';

// https://wix.github.io/react-native-navigation/#/docs/layout-types?id=stack
test('getLayout', () => {
  const stack = new Stack([new Component('A'), new Component('B')], {
    C: 'D',
  });

  expect(stack.getLayout()).toEqual({
    stack: {
      children: [
        { component: { id: 'A', name: 'A' } },
        { component: { id: 'B', name: 'B' } },
      ],
      options: {
        C: 'D',
      },
    },
  });
});
