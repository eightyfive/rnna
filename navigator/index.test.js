import { createWidget } from './index';

import WidgetComponent from './WidgetComponent';

test('create Widget', () => {
  const widget = createWidget('A');

  expect(widget instanceof WidgetComponent).toBe(true);
  expect(widget.id).toBe('widget-A');
});
