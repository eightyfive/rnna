"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overlay = void 0;
const react_native_navigation_1 = require("react-native-navigation");
const Component_1 = require("./Component");
class Overlay extends Component_1.Component {
    mount(props) {
        this.show(props);
    }
    show(props) {
        react_native_navigation_1.Navigation.showOverlay(this.getRoot(props));
    }
    dismiss() {
        react_native_navigation_1.Navigation.dismissOverlay(this.id);
    }
}
exports.Overlay = Overlay;
