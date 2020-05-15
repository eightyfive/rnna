import { createStyles } from './index';

const Theme = {
  colors: {
    primary: 'green',
  },
  sizes: [0, 5, 10, 20, 40, 80],
};

Object.assign(Theme, { createStyles });

describe('Theme', () => {
  it('replaces color', () => {
    const $ = Theme.createStyles({ foo: { color: 'primary' } });

    expect($.foo).toHaveProperty('color', 'green');
  });

  it('size [2]', () => {
    const $ = Theme.createStyles({ foo: { paddingTop: [2] } });

    expect($.foo).toHaveProperty('paddingTop', 10);
  });

  it('size [2, 2]', () => {
    const $ = Theme.createStyles({ foo: { padding: [2, 2] } });

    expect($.foo).toHaveProperty('paddingVertical', 10);
    expect($.foo).toHaveProperty('paddingHorizontal', 10);
  });

  it('size [2, 3, 2]', () => {
    const $ = Theme.createStyles({ foo: { margin: [2, 3, 2] } });

    expect($.foo).toHaveProperty('marginTop', 10);
    expect($.foo).toHaveProperty('marginHorizontal', 20);
    expect($.foo).toHaveProperty('marginBottom', 10);
  });

  it('size [1, 2, 3, 4]', () => {
    const $ = Theme.createStyles({ foo: { margin: [1, 2, 3, 4] } });

    expect($.foo).toHaveProperty('marginTop', 5);
    expect($.foo).toHaveProperty('marginRight', 10);
    expect($.foo).toHaveProperty('marginBottom', 20);
    expect($.foo).toHaveProperty('marginLeft', 40);
  });

  it('wrong size index', () => {
    const $ = Theme.createStyles({ foo: { padding: [10] } });

    expect($.foo).toHaveProperty('padding', undefined);
  });

  it('wrong sizes length', () => {
    expect(() => {
      const $ = Theme.createStyles({ foo: { paddingTop: [1, 2] } });
    }).toThrow();
  });

  it('lets properties through', () => {
    const $ = Theme.createStyles({ foo: { flex: 2 } });

    expect($.foo).toHaveProperty('flex', 2);
  });
});
