import { Bundle } from 'rnna';

import epics from './epics';
import Events from './events';

export default class EventsProvider extends Bundle {
  register(container) {
    container.service('events', Events, 'listeners.*');
  }

  getEpics() {
    return epics;
  }
}
