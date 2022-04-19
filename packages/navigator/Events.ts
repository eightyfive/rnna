import { EventsRegistry, Navigation } from 'react-native-navigation';
import { EmitterSubscription } from 'react-native';

export type Listener = () => void;

export type EventNames =
  | 'ComponentDidAppear'
  | 'ComponentDidDisappear'
  | 'CommandCompleted'
  | 'BottomTabSelected'
  | 'BottomTabPressed'
  | 'BottomTabLongPressed'
  | 'NavigationButtonPressed'
  | 'ModalDismissed'
  | 'ModalAttemptedToDismiss'
  | 'SearchBarUpdated'
  | 'SearchBarCancelPressed'
  | 'PreviewCompleted'
  | 'Command'
  | 'ScreenPopped';

export const Events = {
  addListener(eventName: EventNames, listener: Listener): EmitterSubscription {
    const events: EventsRegistry = Navigation.events();

    return events[`register${eventName}Listener`](listener);
  },

  removeListener(subscription: EmitterSubscription) {
    subscription.remove();
  },
};
