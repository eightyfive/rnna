"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBottomTabsLayout = exports.createStackLayout = exports.createComponentLayout = exports.createStacks = exports.createComponents = void 0;
const Component_1 = require("./Component");
const Stack_1 = require("./Stack");
function createComponents() {
    const A = new Component_1.Component('a', 'A', {
        topBar: { title: { text: 'Title A' } },
    });
    const B = new Component_1.Component('b', 'B', {
        topBar: { title: { text: 'Title B' } },
    });
    const C = new Component_1.Component('c', 'C', {
        topBar: { title: { text: 'Title C' } },
    });
    const D = new Component_1.Component('d', 'D', {
        topBar: { title: { text: 'Title D' } },
    });
    return { A, B, C, D };
}
exports.createComponents = createComponents;
function createStacks() {
    const { A, B, C, D } = createComponents();
    const ab = new Stack_1.Stack({ A, B });
    const cd = new Stack_1.Stack({ C, D });
    return { ab, cd };
}
exports.createStacks = createStacks;
function createComponentLayout(id, name, options, props) {
    const layout = {
        id,
        name,
    };
    if (options) {
        layout.options = options;
    }
    if (props) {
        layout.passProps = props;
    }
    return layout;
}
exports.createComponentLayout = createComponentLayout;
function createStackLayout(index, components, options = {}) {
    return {
        id: `Stack${index}`,
        children: components.map(component => ({ component })),
        options,
    };
}
exports.createStackLayout = createStackLayout;
function createBottomTabsLayout(index, stacks, options) {
    return {
        id: `BottomTabs${index}`,
        children: stacks.map(stack => ({ stack })),
        options,
        // options: { tabsAttachMode: 'onSwitchToTab' },
    };
}
exports.createBottomTabsLayout = createBottomTabsLayout;
