"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Widget = void 0;
const Component_1 = require("./Component");
class Widget extends Component_1.Component {
    constructor(name, options) {
        super(`widget-${name}`, name, options);
    }
}
exports.Widget = Widget;
