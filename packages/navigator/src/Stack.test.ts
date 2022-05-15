import { Navigation } from 'react-native-navigation';
import {
  createComponents,
  createComponentLayout,
  createStackLayout,
} from './test-utils';
import { Stack } from './Stack';

let app: Stack;

const options = {
  iconColor: 'grey',
  selectedIconColor: 'black',
};

const props = { foo: 'bar' };

describe('Stack', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const components = createComponents();

    app = new Stack(components, options);
    app.mount();
  });

  test('mount', () => {
    expect(app.id).toBe('A-B-C-D');

    expect(Navigation.push).not.toHaveBeenCalled();

    expect(Navigation.setRoot).toHaveBeenCalledWith({
      root: {
        stack: createStackLayout('A-B-C-D', [createComponentLayout('A')], {
          bottomTab: options,
        }),
      },
    });
  });

  test('push', () => {
    app.push('B', props);

    expect(Navigation.push).toHaveBeenCalledWith('A-B-C-D', {
      component: createComponentLayout('B', undefined, props),
    });
  });

  test('pop', () => {
    app.push('B', props);
    app.push('C', props);
    app.pop();

    expect(Navigation.pop).toHaveBeenCalledWith('A-B-C-D');
  });

  test('popToRoot', () => {
    app.push('B', props);
    app.push('C', props);
    app.popToRoot();

    expect(Navigation.popToRoot).toHaveBeenCalledWith('A-B-C-D');
  });
});
