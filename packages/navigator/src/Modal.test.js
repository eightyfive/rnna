"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_navigation_1 = require("react-native-navigation");
const test_utils_1 = require("./test-utils");
const Stack_1 = require("./Stack");
const Modal_1 = require("./Modal");
let app;
const props = { foo: 'bar' };
describe('Modal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Stack_1.Stack.layoutIndex = 0;
        const components = (0, test_utils_1.createComponents)();
        app = new Modal_1.Modal(components);
        app.mount();
    });
    test('show', () => {
        app.show(props);
        expect(react_native_navigation_1.Navigation.showModal).toHaveBeenCalledWith({
            stack: (0, test_utils_1.createStackLayout)(0, [
                (0, test_utils_1.createComponentLayout)('a', 'A', {
                    topBar: {
                        title: { text: 'Title A' },
                    },
                }),
            ]),
        });
    });
    test('dismiss', () => {
        app.dismiss();
        expect(react_native_navigation_1.Navigation.dismissModal).toHaveBeenCalledWith(app.id);
    });
});
