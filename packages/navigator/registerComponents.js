import { registerComponent } from './utils';

const o = {
  entries: Object.entries,
};

export default function registerComponents(
  screens,
  Provider = null,
  store = null,
) {
  for (const [name, Screen] of o.entries(screens)) {
    registerComponent(name, Screen, Provider, store);
  }
}
