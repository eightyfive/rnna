"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const react_native_navigation_1 = require("react-native-navigation");
const Layout_1 = require("./Layout");
class Component extends Layout_1.Layout {
    constructor(id, name, options) {
        super(id, options);
        this.name = name;
    }
    getLayout(props) {
        const layout = {
            id: this.id,
            name: this.name,
        };
        if (this.options) {
            layout.options = Object.assign({}, this.options);
        }
        if (props) {
            layout.passProps = Object.assign({}, props);
        }
        return layout;
    }
    getRoot(props) {
        return {
            component: this.getLayout(props),
        };
    }
    mount(props) {
        react_native_navigation_1.Navigation.setRoot({
            root: this.getRoot(props),
        });
    }
}
exports.Component = Component;
