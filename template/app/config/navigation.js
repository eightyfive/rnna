import { Platform } from 'react-native';

import { colors } from '../views/theme';

const isAndroid = Platform.OS === 'android';

export const defaultOptions = {
  animations: {
    push: { waitForRender: isAndroid },
  },
  statusBar: {
    visible: true,
  },
  topBar: {
    animate: false,
    backButton: {
      color: 'white',
    },
    background: {
      color: colors.background,
    },
    title: {
      color: 'white',
    },
  },
  layout: {
    // https://github.com/wix/react-native-navigation/blob/master/CHANGELOG.md#600
    componentBackgroundColor: colors.primary,
  },
  // bottomTabs: {
  //   backgroundColor: colors.background,
  // },
  // bottomTab: {
  //   textColor: colors.disabled,
  //   selectedTextColor: colors.primary,
  //   iconColor: colors.disabled,
  //   selectedIconColor: colors.primary,
  // },
};
