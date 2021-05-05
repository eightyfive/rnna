import WidgetComponent from './WidgetComponent';

test('getLayout', () => {
  const component = new WidgetComponent('ID', 'NAME');

  expect(component.getLayout()).toEqual({
    component: {
      id: 'widget-ID',
      name: 'NAME',
      options: {},
      passProps: {},
    },
  });
});
