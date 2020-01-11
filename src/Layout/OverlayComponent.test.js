import OverlayComponent from './OverlayComponent';

test('getLayout', () => {
  const component = new OverlayComponent('ID');

  expect(component.getLayout()).toEqual({
    component: {
      id: 'overlay-ID',
      name: 'overlay-ID',
    },
  });
});
