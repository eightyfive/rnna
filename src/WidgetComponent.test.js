import WidgetComponent from './WidgetComponent';

test('getLayout', () => {
  const component = new WidgetComponent('ID');

  expect(component.getLayout()).toEqual({
    component: {
      id: 'widget-ID',
      name: 'widget-ID',
    },
  });
});
