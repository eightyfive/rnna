import _set from 'lodash/set';

export default function getNavigationOptions(nav) {
  const options = {};

  if (!nav) {
    return options;
  }

  if (nav.header === null) {
    _set(options, 'topBar.visible', false);
    _set(options, 'topBar.drawBehind', true);
  } else {
    if (nav.title) {
      _set(options, 'topBar.title.text', nav.title);
    }

    if (nav.headerTintColor) {
      _set(options, 'topBar.title.color', nav.headerTintColor);
    }

    let style;

    style = nav.headerStyle;
    if (style && style.backgroundColor) {
      _set(options, 'topBar.background.color', style.backgroundColor);
    }

    style = nav.headerBackTitleStyle;
    if (style && style.color) {
      _set(options, 'topBar.backButton.color', style.color);
    }
  }

  return options;
}
