import createStackNavigator from './createStackNavigator';

export default function createModalNavigator(routes, config = {}) {
  config.mode = 'modal';

  return createStackNavigator(routes, config);
}
