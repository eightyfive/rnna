import React from 'react';

import { Col, ActivityIndicator } from '../atoms';

export default function Loading() {
  return (
    <Col.C style={{ flex: 1 }}>
      <ActivityIndicator large />
    </Col.C>
  );
}
