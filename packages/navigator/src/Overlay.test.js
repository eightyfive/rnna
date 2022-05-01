"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_navigation_1 = require("react-native-navigation");
const test_utils_1 = require("./test-utils");
const Overlay_1 = require("./Overlay");
let app;
const props = { foo: 'bar' };
describe('Overlay', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        app = new Overlay_1.Overlay('a', 'A');
        app.mount();
    });
    test('show', () => {
        app.show(props);
        expect(react_native_navigation_1.Navigation.showOverlay).toHaveBeenCalledWith({
            component: (0, test_utils_1.createComponentLayout)('a', 'A'),
        });
    });
    test('dismiss', () => {
        app.dismiss();
        expect(react_native_navigation_1.Navigation.dismissOverlay).toHaveBeenCalledWith(app.id);
    });
});
