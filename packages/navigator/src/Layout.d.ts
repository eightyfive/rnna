import { Options } from 'react-native-navigation';
export declare type Props = Record<string, string | number | boolean>;
export declare abstract class Layout<LayoutT, LayoutOptions = Options> {
    id: string;
    options: LayoutOptions | undefined;
    constructor(id: string, options?: LayoutOptions);
    abstract mount(props?: Props): void;
    abstract getLayout(props?: Props): LayoutT;
    abstract getRoot(props?: Props): Record<string, LayoutT>;
}
