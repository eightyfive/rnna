import React, { ComponentType } from 'react';
import { ViewProps } from 'react-native';

import { createCol, flexStyles as $ } from 'react-native-col';

export function createCol1<P extends ViewProps>(Component: ComponentType<any>) {
  return createCol<P>(({ style, ...rest }) => (
    <Component {...rest} style={[$.f1, style]} />
  ));
}
