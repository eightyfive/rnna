import { createSelector } from 'reselect';
import db from './db';

const initialState = {
  byId: { 1: 'A', 2: 'B', 3: 'C' },
  result: [1, 2],
};

db.setState({ ...initialState });

describe('DB', () => {
  it('sets state', () => {
    expect(db.state).toEqual(initialState);
    expect(db.state).not.toBe(initialState);
  });

  it('selects', () => {
    db.getResult = createSelector(
      state => state.byId,
      state => state.result,
      (byId, result) => result.map(id => byId[id]),
    );

    expect(db.getResult()).toEqual(['A', 'B']);
  });

  it('changes state & selects', () => {
    // Change array VALUE in order to trigger selector change
    const state = {
      ...initialState,
      result: [1, 2, 3],
    };

    db.setState(state);

    expect(db.state).toEqual(state);
    expect(db.getResult()).toEqual(['A', 'B', 'C']);
  });

  it('throws when selector exists', () => {
    expect(() => {
      db.getResult = () => {};
    }).toThrow();
  });

  it('throws when set state', () => {
    expect(() => {
      db.state = {};
    }).toThrow();
  });

  it('assigns selectors', () => {
    const selectors = {
      barbar() {},
      foo() {},
      bar() {},
    };

    Object.assign(db, selectors);

    expect(db.barbar).toBeDefined();
    expect(db.foo).toBeDefined();
    expect(db.bar).toBeDefined();
  });

  it('throws when assigning existing', () => {
    expect(() => {
      const selectors = {
        newSelector() {},
        barbar() {},
        selectorNotSet() {},
      };

      Object.assign(db, selectors);
    }).toThrow();

    expect(db.newSelector).toBeDefined();

    expect(() => {
      db.selectorNotSet();
    }).toThrow();
  });
});
