import { Navigation } from 'react-native-navigation';

import { createComponentLayout } from './test-utils';
import { Overlay } from './Overlay';

let app: Overlay;

const props = { foo: 'bar' };

describe('Overlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    app = new Overlay('A');
    app.mount();
  });

  test('show', () => {
    app.show(props);

    expect(Navigation.showOverlay).toHaveBeenCalledWith({
      component: createComponentLayout('A', undefined, props),
    });
  });

  test('dismiss', () => {
    app.dismiss();

    expect(Navigation.dismissOverlay).toHaveBeenCalledWith('A');
  });
});
