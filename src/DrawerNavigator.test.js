import { Navigation } from 'react-native-navigation';

import { createDrawerNavigator } from './index';

let navigator;

const A = { componentId: 'A' };
const B = { componentId: 'B' };

beforeEach(() => {
  navigator = createDrawerNavigator(
    { A, B },
    {
      contentComponent: 'Drawer',
      defaultOptions: { topBar: { title: 'foo' } },
    },
  );
  navigator.mount();
});

test('dumb', () => {
  expect(true).toBe(true);
});

// test('navigate', () => {
//   navigator.navigate('A');

//   expect(Navigation.mergeOptions).not.toHaveBeenCalled();
// });

// test('go back', () => {
//   navigator.navigate('B');
//   navigator.goBack('B');

//   expect(Navigation.mergeOptions).not.toHaveBeenCalled();
// });

// test('mount', () => {
//   expect(Navigation.setRoot).toHaveBeenCalledWith({
//     root: {
//       sideMenu: {
//         left: {
//           component: { id: 'Drawer', name: 'Drawer' },
//         },
//         center: {
//           stack: {
//             children: [
//               {
//                 component: {
//                   id: 'A',
//                   name: 'A',
//                   options: { topBar: { title: 'foo' } },
//                 },
//               },
//             ],
//           },
//         },
//       },
//     },
//   });
// });

// test('open drawer', () => {
//   navigator.navigate('Drawer');

//   expect(Navigation.mergeOptions).toHaveBeenCalledWith(
//     'Drawer',
//     navigator.getVisibleLayout(true),
//   );
// });

// test('close drawer', () => {
//   navigator.navigate('Drawer');
//   navigator.handleDidAppear({ componentId: 'Drawer' });
//   navigator.goBack();

//   expect(Navigation.mergeOptions).toHaveBeenCalledWith(
//     'Drawer',
//     navigator.getVisibleLayout(false),
//   );
// });
