import { Navigation } from 'react-native-navigation';

import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from './test-utils';
import { Stack } from './Stack';
import { Modal } from './Modal';

let app: Modal;

const props = { foo: 'bar' };

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Stack.layoutIndex = 0;

    const components = createComponents();

    app = new Modal(components);
    app.mount();
  });

  test('show', () => {
    app.show(props);

    expect(Navigation.showModal).toHaveBeenCalledWith({
      stack: createStackLayout(0, [
        createComponentLayout('a', 'A', {
          topBar: {
            title: { text: 'Title A' },
          },
        }),
      ]),
    });
  });

  test('dismiss', () => {
    app.dismiss();

    expect(Navigation.dismissModal).toHaveBeenCalledWith(app.id);
  });
});
