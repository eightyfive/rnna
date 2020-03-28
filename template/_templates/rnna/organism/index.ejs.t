---
to: app/views/organisms/<%= h.changeCase.paramCase(name) %>.js
---
import React from 'react';
import Col from 'react-native-col';

import { Text } from '../atoms';
// import { FooBar } from '../molecules';

export default function <%= name %>({ foo, bar }) {
  return <Col><Text><%= name %></Text></Col>;
}

