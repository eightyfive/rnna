import { Options } from 'react-native-navigation';
import { Component, ComponentLayout } from './Component';
import { Props } from './Layout';
import { StackLayout } from './Stack';
export declare function createComponents(): {
    A: Component;
    B: Component;
    C: Component;
    D: Component;
};
export declare function createStacks(): {
    ab: any;
    cd: any;
};
export declare function createComponentLayout(id: string, name: string, options?: Options, props?: Props): ComponentLayout;
export declare function createStackLayout(index: number, components: ComponentLayout[], options?: {}): {
    id: string;
    children: {
        component: ComponentLayout;
    }[];
    options: {};
};
export declare function createBottomTabsLayout(index: number, stacks: StackLayout[], options?: Options): {
    id: string;
    children: {
        stack: StackLayout;
    }[];
    options: Options | undefined;
};
