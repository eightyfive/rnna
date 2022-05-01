"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const react_native_navigation_1 = require("react-native-navigation");
const Stack_1 = require("./Stack");
class Modal extends Stack_1.Stack {
    mount(props) {
        this.show(props);
    }
    show(props) {
        react_native_navigation_1.Navigation.showModal(this.getRoot(props));
        this.init();
    }
    dismiss() {
        react_native_navigation_1.Navigation.dismissModal(this.id);
    }
}
exports.Modal = Modal;
