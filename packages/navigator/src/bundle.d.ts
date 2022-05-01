import { ReactElement } from 'react';
import { Bundle } from 'rnna';
import { BottomTabs } from './BottomTabs';
import { Component } from './Component';
import { Modal } from './Modal';
import { Overlay } from './Overlay';
import { Stack } from './Stack';
import { Widget } from './Widget';
import { ReactComponent } from './types';
declare type LayoutType = BottomTabs | Component | Modal | Overlay | Stack | Widget;
declare type NavigatorType = Record<string, LayoutType>;
declare type NavigatorOptions = {
    Provider: ReactComponent;
    routes: NavigatorType;
    SplashScreen: ReactElement;
};
declare type PartialServices = Record<string, any> & {
    navigator: NavigatorType;
};
export declare class NavigatorBundle extends Bundle<NavigatorOptions> {
    register(container: any): void;
    boot<StoreT>(services: PartialServices, store: StoreT): void;
}
export {};
