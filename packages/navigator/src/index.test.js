"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BottomTabs_1 = require("./BottomTabs");
const Component_1 = require("./Component");
const Modal_1 = require("./Modal");
const Stack_1 = require("./Stack");
const Widget_1 = require("./Widget");
const index_1 = require("./index");
function A() {
    return null;
}
function B() {
    return null;
}
function C() {
    return null;
}
function D() {
    return null;
}
test('createWidget', () => {
    const widget = (0, index_1.createWidget)('E');
    expect(widget instanceof Widget_1.Widget).toBe(true);
    expect(widget.id).toBe('widget-E');
    expect(widget.name).toBe('E');
});
// Bottom tabs
test('createBottomTabs', () => {
    const app = (0, index_1.createBottomTabs)({
        ab: { A, B },
        cd: { C, D },
    });
    app.mount();
    expect(app).toBeInstanceOf(BottomTabs_1.BottomTabs);
    const stack = app.getStackAt(0);
    expect(stack).toBeInstanceOf(Stack_1.Stack);
    const component = Array.from(stack.components.values())[0];
    expect(component).toBeInstanceOf(Component_1.Component);
    expect(component.id).toBe('ab/A');
    expect(component.name).toBe('A');
});
// Modal
test('createModal', () => {
    const app = (0, index_1.createModal)({ A, B });
    expect(app).toBeInstanceOf(Modal_1.Modal);
});
// Stack
test('createStack', () => {
    const app = (0, index_1.createStack)({ A, B });
    expect(app).toBeInstanceOf(Stack_1.Stack);
});
