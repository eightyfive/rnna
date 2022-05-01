"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomTabs = void 0;
const react_native_navigation_1 = require("react-native-navigation");
const Layout_1 = require("./Layout");
class BottomTabs extends Layout_1.Layout {
    constructor(stacks, options) {
        super(`BottomTabs${BottomTabs.layoutIndex++}`, options);
        this.stacks = new Map(Object.entries(stacks));
        // Tab loading
        // // https://wix.github.io/react-native-navigation/docs/bottomTabs#controlling-tab-loading
        // this.options.bottomTabs?.tabsAttachMode =
        //   this.options.bottomTabs?.tabsAttachMode || 'onSwitchToTab';
        this.order = Object.keys(stacks);
        this.tabIndex = 0;
    }
    getLayout(props) {
        const children = this.order.map((name, index) => {
            const stack = this.stacks.get(name);
            if (index === 0) {
                return stack.getRoot(props);
            }
            return stack.getRoot();
        });
        const layout = {
            id: this.id,
            children,
        };
        if (this.options) {
            layout.options = Object.assign({}, this.options);
        }
        return layout;
    }
    getRoot(props) {
        return {
            bottomTabs: this.getLayout(props),
        };
    }
    mount(props) {
        react_native_navigation_1.Navigation.setRoot({
            root: this.getRoot(props),
        });
        for (const stack of this.stacks.values()) {
            stack.init();
        }
    }
    selectTab(index) {
        this.tabIndex = index;
        react_native_navigation_1.Navigation.mergeOptions(this.id, {
            bottomTabs: { currentTabIndex: index },
        });
    }
    getStackAt(index) {
        const name = this.order[index];
        const stack = this.stacks.get(name);
        if (!stack) {
            throw new Error(`Stack not found at index: ${index}`);
        }
        return stack;
    }
}
exports.BottomTabs = BottomTabs;
BottomTabs.layoutIndex = 0;
