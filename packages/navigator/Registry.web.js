import { AppRegistry } from 'react-native';

const components = new Map();

const Registry = {
  register(componentId, componentName, Component) {
    AppRegistry.registerComponent(componentName, () => Component);

    components.set(componentId, Component);
  },

  get(componentId) {
    return components.get(componentId);
  },
};

export default Registry;
