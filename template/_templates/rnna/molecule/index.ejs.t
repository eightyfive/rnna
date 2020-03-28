---
to: app/views/molecules/<%= h.changeCase.paramCase(name) %>.js
---
import React from 'react';
import Col from 'react-native-col';

import { Text } from '../atoms';

export default function <%= name %>({ foo, bar }) {
  return <Col><Text><%= name %></Text></Col>;
}

