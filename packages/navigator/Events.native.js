import { Navigation } from 'react-native-navigation';

export default {
  addListener(eventName, listener) {
    const events = Navigation.events();

    return events[`register${eventName}Listener`](listener);
  },

  removeListener(subscription) {
    subscription.remove();
  },
};
