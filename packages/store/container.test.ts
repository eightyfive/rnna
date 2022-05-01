import { createInjector, Injector } from 'typed-inject';
import { Bundle } from './bundle';
import { Container } from './container';

class Car {
  brand: string;
  year: number;

  public static inject = ['carBrand', 'carYear'] as const;

  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
}

class Person {
  car: Car;
  name: string;

  constructor(name: string, car: Car) {
    this.name = name;
    this.car = car;
  }

  toString() {
    return `I am ${this.name} and I own a ${this.car.brand} (${this.car.year})`;
  }
}

function personFactory(car: Car) {
  return new Person('Benoit', car);
}

personFactory.inject = ['car'] as const;

const container = createInjector()
  .provideValue('carBrand', 'VW')
  .provideValue('carYear', 1992)
  // .provideClass('car', Car)
  .provideFactory('person', personFactory);

function resolve() {
  return {
    car: container.resolve('car'),
    person: container.resolve('person'),
  };
}

const services = new Map<string, any>();

services.set('car', new Car('VW', 1999));

const car = services.get('car');

car.brand;

// const services = resolve();

// services.car;
// services.person;

// const container = new Container<Services>();

test('car', () => {
  expect(services.car.brand).toEqual('VW');
});

test('person', () => {
  expect(services.person.toString()).toEqual(
    'I am Benoit and I own a VW (1992)',
  );
});
