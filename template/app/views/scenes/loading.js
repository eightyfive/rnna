import React from 'react';
import Col from 'react-native-col';

import { ActivityIndicator } from '../atoms';
import { sheet } from '../theme';

export default function Loading() {
  return (
    <Col.C style={sheet.content}>
      <ActivityIndicator large />
    </Col.C>
  );
}

