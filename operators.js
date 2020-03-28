import { from, of } from 'rxjs';
import {
  filter,
  ignoreElements,
  map,
  mapTo,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';

export const exec = cb => source =>
  source.pipe(
    tap(action => cb(action)),
    ignoreElements(),
  );

// Accepts regular expressions
export const ofReType = (...expressions) => source =>
  source.pipe(
    filter(({ type }) =>
      expressions.some(re =>
        typeof re === 'string' ? type === re : re.test(type),
      ),
    ),
  );

// Alias
export const ofType = ofReType;

export const takeUntilType = (action$, type) => source =>
  source.pipe(takeUntil(action$.pipe(ofType(type))));

export const mapAction = (typeCreator, payloadCreator) => source =>
  source.pipe(
    map(data => {
      let type;
      let payload = data.payload || data;

      if (typeof typeCreator === 'function') {
        type = typeCreator(payload);
      } else {
        type = typeCreator;
      }

      if (typeof payloadCreator === 'undefined') {
        return { type };
      }

      if (typeof payloadCreator === 'function') {
        payload = payloadCreator(payload);
      } else {
        payload = payloadCreator;
      }

      return { type, payload };
    }),
  );

export const mapToAction = (type, payload) => source =>
  source.pipe(
    mapTo({
      type,
      payload,
    }),
  );

export const startWithAction = (type, payload) => source =>
  source.pipe(
    startWith({
      type,
      payload,
    }),
  );
