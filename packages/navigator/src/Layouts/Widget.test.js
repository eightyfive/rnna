import Widget from './Widget';

test('getLayout', () => {
  const component = new Widget('NAME');

  expect(component.getLayout()).toEqual({
    component: {
      id: 'widget-NAME',
      name: 'NAME',
      options: {},
      passProps: {},
    },
  });
});
