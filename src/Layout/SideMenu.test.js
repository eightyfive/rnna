import Component from './Component';
import SideMenu from './SideMenu';
import Stack from './Stack';

// https://wix.github.io/react-native-navigation/#/docs/layout-types?id=sidemenu
test('getLayout', () => {
  const menu = new Component('MENU');
  const center = new Stack([new Component('A')]);
  const sideMenu = new SideMenu(menu, center, { B: 'C' });

  expect(sideMenu.getLayout()).toEqual({
    sideMenu: {
      left: {
        component: { id: 'MENU', name: 'MENU' },
      },
      center: {
        stack: {
          children: [{ component: { id: 'A', name: 'A' } }],
        },
      },
      options: {
        B: 'C',
      },
    },
  });
});
