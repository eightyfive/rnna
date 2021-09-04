import { createSelector } from 'reselect';
import Db from './';

const db = new Db();

const initialState = {
  byId: { 1: 'A', 2: 'B', 3: 'C' },
  result: [1, 2],
};

let state = { ...initialState };

const store = {
  getState() {
    return state;
  },
};

db.setStore(store);

describe('DB', () => {
  it('sets state', () => {
    expect(db.getState()).toEqual(initialState);
    expect(db.getState()).not.toBe(initialState);
  });

  it('selects result', () => {
    db.getResult = createSelector(
      state => state.byId,
      state => state.result,
      (byId, result) => result.map(id => byId[id]),
    );

    expect(db.getResult()).toEqual(['A', 'B']);
  });

  it('changes state & selects result', () => {
    // Change array VALUE in order to trigger selector change
    state = {
      ...initialState,
      result: [1, 2, 3],
    };

    expect(db.getState()).toEqual(state);
    expect(db.getResult()).toEqual(['A', 'B', 'C']);
  });

  it('throws when selector exists', () => {
    expect(() => {
      db.getResult = () => {};
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
