import { from, merge } from 'rxjs';
import { map, switchMap, skip, tap } from 'rxjs/operators';

import Http from './index';

let api;

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();

  api = new Http('http://example.org', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

describe('Http', () => {
  it('calls fetch', done => {
    api.get('api/resource').subscribe(undefined, undefined, () => {
      expect(fetch).toHaveBeenCalled();
      done();
    });
  });

  it('emits `res`', done => {
    api.get('api/resource').subscribe(res => {
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);

      done();
    });
  });

  it('logs `req` & `res`', done => {
    const log = jest.fn();

    api.use(next => req$ => {
      const res$ = next(req$);

      return merge(req$.pipe(tap(log)), res$.pipe(tap(log))).pipe(skip(1));
    });

    api.get('api/resource').subscribe(res => {
      expect(log).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenNthCalledWith(2, res);

      done();
    });
  });

  it('maps `res` to json and keeps `req` in stream', done => {
    fetch.mockResponse('{"foo": "bar"}');

    api.use(next => req$ =>
      next(req$).pipe(switchMap(res => from(res.json()))),
    );

    api.get('api/resource').subscribe(res => {
      expect(res).toEqual({ foo: 'bar' });
      done();
    });
  });

  it('changes `req`', done => {
    const log = jest.fn();

    api.use(next => req$ => {
      return next(
        req$.pipe(
          tap(req => log(req.method)),
          map(req => new Request(req, { method: 'POST' })),
          tap(req => log(req.method)),
        ),
      );
    });

    api.get('api/resource').subscribe(res => {
      expect(log).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenNthCalledWith(1, 'GET');
      expect(log).toHaveBeenNthCalledWith(2, 'POST');

      done();
    });
  });

  it('emits `req` & `res`', done => {
    const values = [];

    api.use(next => req$ => {
      const res$ = next(req$);

      return merge(req$, res$);
    });

    api.get('api/resource').subscribe(
      val => values.push(val),
      undefined,
      () => {
        expect(values.length).toBe(2);
        const [req, res] = values;

        expect(req.method).toBe('GET');
        expect(req.headers.get('Content-Type')).toBe('application/json');
        expect(req.url).toBe('http://example.org/api/resource');

        expect(res.ok).toBe(true);
        expect(res.status).toBe(200);

        done();
      },
    );
  });
});
