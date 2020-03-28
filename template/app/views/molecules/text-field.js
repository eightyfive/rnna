import React from 'react';
import { StyleSheet } from 'react-native';
import Col from 'react-native-col';

import { Caption, TextInput } from '../atoms';
import { colors, s, ss } from '../theme';

export default function TextField({ error, label, ...rest }) {
  return (
    <Col style={ss.mb3}>
      <Caption style={styles.label}>{label}</Caption>
      <TextInput {...rest} />
      {Boolean(error) && (
        <Caption key={error} style={styles.error}>
          {error}
        </Caption>
      )}
    </Col>
  );
}

const styles = StyleSheet.create({
  label: {
    ...s.mb1,
    color: colors.onBackground,
  },
  error: {
    color: 'red',
  },
});
