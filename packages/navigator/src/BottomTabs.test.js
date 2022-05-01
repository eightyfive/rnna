"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_navigation_1 = require("react-native-navigation");
const test_utils_1 = require("./test-utils");
const BottomTabs_1 = require("./BottomTabs");
const Stack_1 = require("./Stack");
let app;
describe('BottomTabs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        BottomTabs_1.BottomTabs.layoutIndex = 0;
        Stack_1.Stack.layoutIndex = 0;
        const stacks = (0, test_utils_1.createStacks)();
        app = new BottomTabs_1.BottomTabs(stacks);
        app.mount();
    });
    test('mount', () => {
        expect(app.id).toBe('BottomTabs0');
        expect(react_native_navigation_1.Navigation.setRoot).toHaveBeenCalledWith({
            root: {
                bottomTabs: (0, test_utils_1.createBottomTabsLayout)(0, [
                    (0, test_utils_1.createStackLayout)(0, [
                        (0, test_utils_1.createComponentLayout)('a', 'A', {
                            topBar: { title: { text: 'Title A' } },
                        }),
                    ]),
                    (0, test_utils_1.createStackLayout)(1, [
                        (0, test_utils_1.createComponentLayout)('c', 'C', {
                            topBar: { title: { text: 'Title C' } },
                        }),
                    ]),
                ]),
            },
        });
        expect(app.tabIndex).toBe(0);
    });
    test('select tab', () => {
        app.selectTab(1);
        expect(react_native_navigation_1.Navigation.mergeOptions).toHaveBeenCalledWith('BottomTabs0', {
            bottomTabs: { currentTabIndex: 1 },
        });
    });
});
