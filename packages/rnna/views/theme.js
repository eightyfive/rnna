const sizeAliases = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mv: 'marginVertical',
  mh: 'marginHorizontal',
  //
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pv: 'paddingVertical',
  ph: 'paddingHorizontal',
};

function createSpacings(sizes, aliases) {
  const styles = [];

  Object.entries(aliases).forEach(([alias, spacing]) => {
    sizes.forEach((size, index) => {
      styles.push([`${alias}${index}`, { [spacing]: size }]);
    });
  });

  return styles;
}

export default class Theme {
  constructor(sizes, colors, options = {}) {
    this.sizes = sizes;
    this.colors = colors;

    createSpacings(sizes, options.sizeAliases || sizeAliases).forEach(
      ([alias, style]) => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
        Object.defineProperty(this, alias, { value: style });
      },
    );
  }
}
