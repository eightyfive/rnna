import { ReactComponent, ScreenElement } from './types';
export declare function registerScreen(name: string, ScreenComponent: ScreenElement, Provider?: ReactComponent): void;
export declare function createComponents(routes: Record<string, ScreenElement>, parentId?: string): Record<string, Component>;
