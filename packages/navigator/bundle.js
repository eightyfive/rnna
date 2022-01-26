import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider as StoreProvider } from 'react-redux';
import { Bundle } from 'rnna';

import {
  createComponent,
  createRootNavigator,
  registerScreen,
  registerRoutes,
} from './index';

export default class NavigatorBundle extends Bundle {
  register(container) {
    container.constant('navigator', createRootNavigator(this.options.screens));

    if (this.options.SplashScreen) {
      const splash = createComponent('Splash');

      registerScreen(splash.name, this.options.SplashScreen);

      Navigation.events().registerAppLaunchedListener(() => {
        splash.mount();
      });
    }
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
