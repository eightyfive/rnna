import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from './test-utils';
import OverlayNavigator from './OverlayNavigator';

let app;

const props = { foo: 'bar' };

describe('OverlayNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    app = new OverlayNavigator('a', 'A');
    app.mount();
  });

  test('show', () => {
    app.show(props);

    expect(Navigation.showOverlay).toHaveBeenCalledWith({
      component: createComponentLayout('a', 'A'),
    });
  });

  test('dismiss', () => {
    app.dismiss();

    expect(Navigation.dismissOverlay).toHaveBeenCalledWith(app.id);
  });
});
