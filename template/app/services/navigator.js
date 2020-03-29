import { createAppNavigator, setDefaultOptions } from 'rnna';

import { defaultOptions } from '../config/navigation';

setDefaultOptions(defaultOptions);

export default createAppNavigator({
  Loading: {
    componentId: 'Loading',
    options: {
      topBar: {
        visible: false,
      },
    },
  },
  Hello: {
    componentId: 'Hello',
    navigationOptions: {
      title: 'Hello',
    },
  },
});
