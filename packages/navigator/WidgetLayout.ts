import { ComponentLayout } from './ComponentLayout';

export class WidgetLayout extends ComponentLayout {
  constructor(name: string, options = {}) {
    super(`widget-${name}`, name, options);
  }
}
