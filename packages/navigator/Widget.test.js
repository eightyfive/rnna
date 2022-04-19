import { WidgetLayout } from './WidgetLayout';

function WidgetComponent() {}

test('getRoot', () => {
  const component = new WidgetLayout('NAME', WidgetComponent);

  expect(component.getRoot()).toEqual({
    component: {
      id: 'widget-NAME',
      name: 'NAME',
      options: {},
      passProps: {},
    },
  });
});
