import Component from './Component';
import BottomTabs from './BottomTabs';
import Stack from './Stack';

// https://wix.github.io/react-native-navigation/#/docs/layout-types?id=bottomtabs
test('getLayout', () => {
  const stack = new Stack('STACK', [new Component('A')]);
  const bottomTabs = new BottomTabs('TABS', [stack, new Component('B')], {
    C: 'D',
  });

  expect(bottomTabs.getLayout()).toEqual({
    bottomTabs: {
      id: 'TABS',
      name: 'TABS',
      children: [
        {
          stack: {
            id: 'STACK',
            name: 'STACK',
            children: [{ component: { id: 'A', name: 'A' } }],
          },
        },
        { component: { id: 'B', name: 'B' } },
      ],
      options: {
        C: 'D',
      },
    },
  });
});
