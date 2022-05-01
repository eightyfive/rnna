import { Widget } from './Widget';

test('getRoot', () => {
  const component = new Widget('NAME');

  expect(component.getRoot()).toEqual({
    component: {
      id: 'widget-NAME',
      name: 'NAME',
    },
  });
});
