"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_navigation_1 = require("react-native-navigation");
const test_utils_1 = require("./test-utils");
const Stack_1 = require("./Stack");
let app;
const props = { foo: 'bar' };
describe('Stack', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Stack_1.Stack.layoutIndex = 0;
        const components = (0, test_utils_1.createComponents)();
        app = new Stack_1.Stack(components);
        app.mount();
    });
    test('mount', () => {
        expect(app.id).toBe('Stack0');
        expect(react_native_navigation_1.Navigation.push).not.toHaveBeenCalled();
        expect(react_native_navigation_1.Navigation.setRoot).toHaveBeenCalledWith({
            root: {
                stack: (0, test_utils_1.createStackLayout)(0, [
                    (0, test_utils_1.createComponentLayout)('a', 'A', {
                        topBar: {
                            title: { text: 'Title A' },
                        },
                    }),
                ]),
            },
        });
        expect(app.history).toEqual(['A']);
    });
    test('push', () => {
        app.push('B', props);
        expect(app.history).toEqual(['A', 'B']);
        expect(react_native_navigation_1.Navigation.push).toHaveBeenCalledWith('a', {
            component: (0, test_utils_1.createComponentLayout)('b', 'B', {
                topBar: {
                    title: { text: 'Title B' },
                },
            }, props),
        });
    });
    test('pop', () => {
        app.push('B', props);
        app.push('C', props);
        app.pop();
        expect(app.history).toEqual(['A', 'B']);
        expect(react_native_navigation_1.Navigation.pop).toHaveBeenCalledWith('c');
    });
    test('popToRoot', () => {
        app.push('B', props);
        app.push('C', props);
        app.popToRoot();
        expect(app.history).toEqual(['A']);
        expect(react_native_navigation_1.Navigation.popToRoot).toHaveBeenCalledWith('c');
    });
});
