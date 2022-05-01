"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_navigation_1 = require("react-native-navigation");
const test_utils_1 = require("./test-utils");
const Component_1 = require("./Component");
describe('Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('mount (no options)', () => {
        const component = new Component_1.Component('a1', 'A1');
        component.mount();
        expect(react_native_navigation_1.Navigation.setRoot).toHaveBeenCalledWith({
            root: {
                component: (0, test_utils_1.createComponentLayout)('a1', 'A1'),
            },
        });
    });
    test('mount (options)', () => {
        const component = new Component_1.Component('a2', 'A2', {
            topBar: { title: { text: 'Title A2' } },
        });
        component.mount();
        expect(react_native_navigation_1.Navigation.setRoot).toHaveBeenCalledWith({
            root: {
                component: (0, test_utils_1.createComponentLayout)('a2', 'A2', {
                    topBar: { title: { text: 'Title A2' } },
                }),
            },
        });
    });
    test('mount (props)', () => {
        const component = new Component_1.Component('a3', 'A3');
        component.mount({ foo: 'bar' });
        expect(react_native_navigation_1.Navigation.setRoot).toHaveBeenCalledWith({
            root: {
                component: (0, test_utils_1.createComponentLayout)('a3', 'A3', undefined, { foo: 'bar' }),
            },
        });
    });
});
