import { Component } from 'react';

const { pathname } = new URL(document.location);

const initialState = {
  path: pathname.substring(1),
};

export default class App extends Component {
  state = initialState;

  componentDidMount() {
    const { router, store } = this.props;

    this.unsubscribeRouter = router.subscribe(this.handleRoute);
    this.unsubscribeStore = store.subscribe(this.handleState);
  }

  componentWillUnmount() {
    this.unsubscribeRouter();
    this.unsubscribeStore();
  }

  handleRoute = path => {
    this.setState({ path });
  };

  handleState = () => {
    this.forceUpdate();
  };

  render() {
    const { router } = this.props;
    const { path } = this.state;

    const [Screen, props] = router.render(path);

    if (Screen) {
      return <Screen {...props} />;
    }

    return '404 Not Found';
  }
}
