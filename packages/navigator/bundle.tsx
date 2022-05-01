import React, { ReactElement } from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider as StoreProvider } from 'react-redux';
import { Bundle } from 'rnna';

import { createComponent, registerScreen, registerRoutes } from './index';
import { BottomTabs } from './BottomTabs';
import { Component } from './Component';
import { Modal } from './Modal';
import { Overlay } from './Overlay';
import { Stack } from './Stack';
import { Widget } from './Widget';
import { ReactComponent } from './types';

type LayoutType = BottomTabs | Component | Modal | Overlay | Stack | Widget;

type NavigatorType = Record<string, LayoutType>;

type NavigatorOptions = {
  Provider: ReactComponent;
  routes: NavigatorType;
  SplashScreen: ReactElement;
};

type PartialServices = Record<string, any> & {
  navigator: NavigatorType;
};

export class NavigatorBundle extends Bundle<NavigatorOptions> {
  register(container) {
    container.constant('navigator', this.options.routes);

    if (this.options.SplashScreen) {
      const splash = createComponent('Splash');

      registerScreen(splash.name, this.options.SplashScreen);

      Navigation.events().registerAppLaunchedListener(() => {
        splash.mount();
      });
    }
  }

  boot<StoreT>(services: PartialServices, store: StoreT) {
    services.navigator;
    registerRoutes(
      screens,
      createProvider<StoreT>(store, this.options.Provider),
    );
  }
}

function createProvider<StoreT>(store: StoreT, Provider: ReactComponent) {
  const AppProvider: ReactComponent = ({ children }) => {
    const content = Provider ? <Provider>{children}</Provider> : children;

    return <StoreProvider store={store}>{content}</StoreProvider>;
  };

  return AppProvider;
}
