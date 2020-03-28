---
to: app/views/atoms/<%= h.changeCase.paramCase(name) %>.js
---
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  //
});

export default function <%= name %>({ foo, bar }) {
  return <Text><%= name %></Text>;
}

