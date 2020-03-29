import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Env from './env';

// Persist
export const persist = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['session'],
};

if (__DEV__ && Platform.OS === 'android') {
  // https://github.com/facebook/react-native/issues/14101
  // https://github.com/rt2zz/redux-persist/issues/717#issuecomment-437589374
  persist.timeout = 0;
}

// Services
export const services = {
  // bugsnag: Env.BUGSNAG_KEY,
  // oneSignal: Env.ONESIGNAL_APP_ID,
};
