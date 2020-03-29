import React from 'react';

import { Col, Text } from '../atoms';

export default function Hello({ name }) {
  return (
    <Col.C style={{ flex: 1 }}>
      <Text>Hello {name}</Text>
    </Col.C>
  );
}
