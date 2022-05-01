import { Options } from 'react-native-navigation';
import { Layout, Props } from './Layout';
export declare type ComponentLayout = {
    id: string;
    name: string;
    options?: Options;
    passProps?: object;
};
export declare class Component extends Layout<ComponentLayout> {
    name: string;
    constructor(id: string, name: string, options?: Options);
    getLayout(props?: Props): ComponentLayout;
    getRoot(props?: Props): {
        component: ComponentLayout;
    };
    mount(props?: Props): void;
}
