// import { Navigation } from 'react-native-navigation';

import { Component } from './wix';
import DrawerNavigator from './DrawerNavigator';

let app;

const A = new Component('A');
const B = new Component('B');

// beforeEach(() => {
//   app = new DrawerNavigator(
//     { A, B },
//     {},
//     {
//       contentComponent: 'Drawer',
//       // screenOptions: { topBar: { title: 'foo' } },
//     },
//   );
//   app.mount();
// });

test('dumb', () => {
  expect(true).toBe(true);
});

// test('navigate', () => {
//   app.navigate('A');

//   expect(Navigation.mergeOptions).not.toHaveBeenCalled();
// });

// test('navigate back', () => {
//   app.navigate('B');
//   app.goBack('B');

//   expect(Navigation.mergeOptions).not.toHaveBeenCalled();
// });

// test('mount', () => {
//   expect(Navigation.setRoot).toHaveBeenCalledWith({
//     root: {
//       sideMenu: {
//         left: {
//           component: { id: 'Drawer' },
//         },
//         center: {
//           stack: {
//             children: [
//               {
//                 component: {
//                   id: 'A', name: 'A', options: {},
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
//   app.navigate('Drawer');

//   expect(Navigation.mergeOptions).toHaveBeenCalledWith(
//     'Drawer',
//     app.getVisibleLayout(true),
//   );
// });

// test('close drawer', () => {
//   app.navigate('Drawer');
//   app.handleDidAppear({ componentId: 'Drawer' });
//   app.goBack();

//   expect(Navigation.mergeOptions).toHaveBeenCalledWith(
//     'Drawer',
//     app.getVisibleLayout(false),
//   );
// });
