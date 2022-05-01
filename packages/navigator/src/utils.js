"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponents = exports.registerScreen = void 0;
const react_1 = __importDefault(require("react"));
const react_native_navigation_1 = require("react-native-navigation");
const Component_1 = require("./Component");
function registerScreen(name, ScreenComponent, Provider) {
    if (Provider) {
        react_native_navigation_1.Navigation.registerComponent(name, () => (props = {}) => (react_1.default.createElement(Provider, null,
            react_1.default.createElement(ScreenComponent, Object.assign({}, props)))), () => ScreenComponent);
    }
    else {
        react_native_navigation_1.Navigation.registerComponent(name, () => ScreenComponent);
    }
}
exports.registerScreen = registerScreen;
function createComponents(routes, parentId) {
    const components = {};
    Object.entries(routes).forEach(([name, ScreenComponent]) => {
        const id = parentId ? `${parentId}/${name}` : name;
        components[name] = new Component_1.Component(id, name, Object.assign({}, ScreenComponent.options));
    });
    return components;
}
exports.createComponents = createComponents;
