import { Navigation } from 'react-native-navigation';

import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from './test-utils';
import { Modal } from './Modal';

let app: Modal;

const props = { foo: 'bar' };

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const components = createComponents();

    app = new Modal(components);
  });

  test('show', () => {
    expect(app.id).toBe('A-B-C-D');

    app.show(props);

    expect(Navigation.showModal).toHaveBeenCalledWith({
      stack: createStackLayout('A-B-C-D', [
        createComponentLayout('A', undefined, props),
      ]),
    });
  });

  test('dismiss', () => {
    app.dismiss();

    expect(Navigation.dismissModal).toHaveBeenCalledWith('A-B-C-D');
  });
});
