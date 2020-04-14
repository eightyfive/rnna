import _mapKeys from 'lodash.mapkeys';
import { StyleSheet } from 'react-native';

const reColor = /color$/i;
const reSpace = /^(margin|padding)(Top|Right|Bottom|Left|Vertical|Horizontal)?$/;

export function createStyles(rules) {
  const styles = {};

  for (const name in rules) {
    const rule = rules[name];

    styles[name] = {};

    for (const [key, val] of Object.entries(rule)) {
      if (reColor.test(key)) {
        // Apply theme color
        styles[name][key] = this.colors[val] || val;
      } else if (reSpace.test(key) && Array.isArray(val)) {
        const [, spacing, side] = reSpace.exec(key);

        // Unalias space property
        Object.assign(
          styles[name],
          createArrayStyle(
            spacing,
            side,
            val.map(index => this.sizes[index]),
          ),
        );
      } else {
        // Copy
        styles[name][key] = val;
      }
    }
  }

  return StyleSheet.create(styles);
}

function createArrayStyle(spacing, side, sizes) {
  let sides = {};

  if (side && sizes.length > 1) {
    throw new Error(`Invalid sizes length`);
  }

  switch (sizes.length) {
    case 1:
      sides = {
        [side || '']: sizes[0],
      };
      break;

    case 2:
      sides = {
        Vertical: sizes[0],
        Horizontal: sizes[1],
      };
      break;

    case 3:
      sides = {
        Top: sizes[0],
        Horizontal: sizes[1],
        Bottom: sizes[2],
      };
      break;

    case 4:
      sides = {
        Top: sizes[0],
        Right: sizes[1],
        Bottom: sizes[2],
        Left: sizes[3],
      };
      break;

    default:
      break;
  }

  return _mapKeys(sides, (size, side) => `${spacing}${side}`);
}
