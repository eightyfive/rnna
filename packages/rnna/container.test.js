import Container from './container';

const container = new Container();

class Car {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
}

class Person {
  constructor(car) {
    this.car = car;
  }

  toString() {
    return `I own a ${this.car.brand} (${this.car.year})`;
  }
}

test('constant', () => {
  container.constant('BRAND', 'VW');
  container.constant('YEAR', 1992);

  expect(container.services.YEAR).toEqual(1992);
});

test('factory', () => {
  container.factory('car', services => {
    return new Car(services.BRAND, services.YEAR);
  });

  expect(container.services.car).toBeInstanceOf(Car);
  expect(container.services.car.brand).toEqual('VW');
  expect(container.services.car.year).toEqual(1992);
});

test('service', () => {
  container.service('person', Person, 'car');

  expect(container.services.person).toBeInstanceOf(Person);
  expect(container.services.person.toString()).toEqual('I own a VW (1992)');
});
