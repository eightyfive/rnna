"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Widget_1 = require("./Widget");
test('getRoot', () => {
    const component = new Widget_1.Widget('NAME');
    expect(component.getRoot()).toEqual({
        component: {
            id: 'widget-NAME',
            name: 'NAME',
        },
    });
});
