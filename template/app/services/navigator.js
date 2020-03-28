import {
  createAppNavigator,
  createStackNavigator,
  setDefaultOptions,
} from 'rnna';

import { defaultOptions } from '../config/navigation';

setDefaultOptions(defaultOptions);

export default createAppNavigator({
  Loading: {
    componentId: 'Loading',
  },
  main: createStackNavigator({
    Hello: {
      componentId: 'Hello',
    },
  }),
  auth: createStackNavigator({
    Register: {
      componentId: 'Register',
      navigationOptions: {
        title: 'Sign up',
      },
    },
    Login: {
      componentId: 'Login',
      navigationOptions: {
        title: 'Sign in',
      },
    },
  }),
});
