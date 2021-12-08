import Widget from './Widget';

function WidgetComponent() {}

test('getRoot', () => {
  const component = new Widget('NAME', WidgetComponent);

  expect(component.getRoot()).toEqual({
    component: {
      id: 'widget-NAME',
      name: 'NAME',
      options: {},
      passProps: {},
    },
  });
});
