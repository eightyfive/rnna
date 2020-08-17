import React from 'react';
import { View } from 'react-native';
import SpaceSheet from 'react-native-spacesheet';

export function makeView(sizes, BaseView = View) {
  const spaceSheet = SpaceSheet.create(sizes);

  return function SpaceView({ style, ...props }) {
    const [styles, rest] = spaceSheet.extract(props);

    if (style) {
      styles.push(style);
    }

    return <BaseView {...rest} style={styles} />;
  };
}
