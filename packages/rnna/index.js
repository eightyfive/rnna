export { default as Container } from 'bottlejs';

export class ServiceProvider {
  register(container) {
    throw new Error(`Abstract: Implement ServiceProvider register method`);
  }

  boot(services, store) {}
}
