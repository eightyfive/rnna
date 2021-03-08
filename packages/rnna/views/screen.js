import { PureComponent } from 'react';
import _memoize from 'lodash.memoize';

const memoKey = (a, b) => String(a) + JSON.stringify(b);

export default class Screen extends PureComponent {
  constructor(props) {
    super(props);

    this.dispatcher = _memoize(this.dispatcher, memoKey);
    this.setter = _memoize(this.setter, memoKey);
  }

  dispatch = (label, payload) => {
    const { dispatch } = this.props;

    const type = `[${this.constructor.displayName}] ${label}`;

    dispatch(type, payload);
  };

  dispatcher = label => payload => {
    // onPress(ev) is undocumented
    if (payload && payload.nativeEvent) {
      this.dispatch(label);
    } else {
      this.dispatch(label, payload);
    }
  };

  setter = key => val => this.setState({ [key]: val });

  set = (key, val) => this.setState({ [key]: val });
}
