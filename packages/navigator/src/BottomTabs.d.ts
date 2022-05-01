import { Options } from 'react-native-navigation';
import { Layout, Props } from './Layout';
import { StackLayout, Stack } from './Stack';
declare type BottomTabsChildLayout = {
    stack: StackLayout;
};
export declare type BottomTabsLayout = {
    id: string;
    children: BottomTabsChildLayout[];
    options?: Options;
};
export declare class BottomTabs extends Layout<BottomTabsLayout> {
    static layoutIndex: number;
    stacks: Map<string, Stack>;
    tabIndex: number;
    order: string[];
    constructor(stacks: Record<string, Stack>, options?: Options);
    getLayout(props?: Props): BottomTabsLayout;
    getRoot(props?: Props): {
        bottomTabs: BottomTabsLayout;
    };
    mount(props?: Props): void;
    selectTab(index: number): void;
    getStackAt(index: number): any;
}
export {};
