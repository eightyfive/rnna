'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _react = require('react');

var _lodash = _interopRequireDefault(require('lodash.memoize'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const memoKey = (a, b) => String(a) + JSON.stringify(b);

class Screen extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, 'dispatcher', label => payload => {
      // onPress(ev) is undocumented
      if (payload && payload.nativeEvent) {
        this.dispatch(label);
      } else {
        this.dispatch(label, payload);
      }
    });

    _defineProperty(this, 'setter', key => val =>
      this.setState({
        [key]: val,
      }),
    );

    this.dispatcher = (0, _lodash.default)(this.dispatcher, memoKey);
    this.setter = (0, _lodash.default)(this.setter, memoKey);
  }

  dispatch(label, payload) {
    const { dispatch } = this.props;
    const { displayName } = this.constructor;
    let type;

    if (displayName) {
      type = `${displayName}/${label}`;
    } else {
      type = label;
    }

    return dispatch(type, payload);
  }

  set(key, val) {
    return this.setState({
      [key]: val,
    });
  }
}

exports.default = Screen;
