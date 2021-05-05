import WidgetComponent from './WidgetComponent';

test('getLayout', () => {
  const component = new WidgetComponent('NAME');

  expect(component.getLayout()).toEqual({
    component: {
      id: 'widget-NAME',
      name: 'NAME',
      options: {},
      passProps: {},
    },
  });
});
