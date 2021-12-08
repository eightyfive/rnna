import { Navigation } from 'react-native-navigation';

const components = new Map();

const Registry = {
  register(componentId, componentName, Component) {
    Navigation.registerComponent(componentName, () => Component);

    components.set(componentId, Component);
  },

  get(componentId) {
    return components.get(componentId);
  },
};

export default Registry;
