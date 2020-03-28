---
to: app/views/scenes/<%= h.changeCase.paramCase(name) %>.js
---
import React from 'react';

import { Content, Text } from '../atoms';

export default function <%= name %>({ foo }) {
  return (
    <Content>
      <Text><%= name %></Text>
    </Content>
  );
}
