import { PureComponent } from 'react';
import { Navigation } from 'react-native-navigation';
import _memoize from 'lodash.memoize';

const memoKey = (a, b) => String(a) + JSON.stringify(b);

export default class Screen extends PureComponent {
  constructor(props) {
    super(props);

    this.dispatcher = _memoize(this.dispatcher, memoKey);
    this.setter = _memoize(this.setter, memoKey);
  }

  dispatcher = label => payload => {
    // onPress(ev) is undocumented
    if (payload && payload.nativeEvent) {
      this.dispatch(label);
    } else {
      this.dispatch(label, payload);
    }
  };

  setter = key => val => this.setState({ [key]: val });

  dispatch(label, payload) {
    const { dispatch } = this.props;
    const { displayName } = this.constructor;

    let type;

    if (displayName) {
      type = `${displayName}/${label}`;
    } else {
      type = label;
    }

    return dispatch({ type, payload });
  }

  set(key, val) {
    return this.setState({ [key]: val });
  }

  mergeOptions(options) {
    const { componentId } = this.props;

    Navigation.mergeOptions(componentId, options);
  }

  mergeTitle(title) {
    this.mergeOptions({
      topBar: {
        title: {
          text: title,
        },
      },
    });
  }
}
