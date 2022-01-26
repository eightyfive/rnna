import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Bundle } from 'rnna';

import { createRootNavigator, registerRoutes } from './index';

export default class NavigatorBundle extends Bundle {
  register(container) {
    container.constant('navigator', createRootNavigator(this.options.screens));
  }

  boot(services, store) {
    registerRoutes(
      this.options.screens,
      createProvider(store, this.options.Provider),
    );
  }
}

const createProvider = (store, Provider) => ({ children }) => {
  const content = Provider ? <Provider>{children}</Provider> : children;

  return <StoreProvider store={store}>{content}</StoreProvider>;
};
