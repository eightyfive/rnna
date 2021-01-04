import React from 'react';
import { View } from 'react-native';

const o = Object;

const aliases = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  v: 'Vertical',
  h: 'Horizontal',
};

function createStyles(type, sizes) {
  const styles = {};

  sizes.forEach((size, index) => {
    styles[index] = { [type]: size };
  });

  o.entries(aliases).forEach(([alias, name]) => {
    sizes.forEach((size, index) => {
      styles[`${alias}${index}`] = { [`${type}${name}`]: size };
    });
  });

  return styles;
}

export function createMargin(sizes) {
  return createStyles('margin', sizes);
}

export function createPadding(sizes) {
  return createStyles('padding', sizes);
}

export function createView(margin, padding) {
  return ({ m, p, style, ...rest }) => {
    const styles = [];

    if (m) {
      m.split(' ').forEach(id => {
        styles.push(margin[id]);
      });
    }

    if (p) {
      p.split(' ').forEach(id => {
        styles.push(padding[id]);
      });
    }

    if (style) {
      styles.push(style);
    }

    return <View {...rest} style={styles} />;
  };
}
