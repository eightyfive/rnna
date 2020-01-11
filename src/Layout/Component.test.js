import Component from './Component';

// https://wix.github.io/react-native-navigation/#/docs/layout-types?id=component
test('getLayout', () => {
  const component = new Component('ID', { A: 'B' });

  expect(component.getLayout({ C: 'D' })).toEqual({
    component: {
      id: 'ID',
      name: 'ID',
      options: {
        A: 'B',
      },
      passProps: {
        C: 'D',
      },
    },
  });
});
