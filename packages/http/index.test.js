import { from, merge } from 'rxjs';
import { switchMap, skip, take, tap } from 'rxjs/operators';

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

  it('emits `req` & `res`', done => {
    const values = [];

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

  it('logs `req` & `res`', done => {
    const values = [];
    const log = jest.fn();

    api.use(next => req => {
      const rr$ = next(req);

      // Log req
      const req$ = rr$.pipe(take(1), tap(log));

      // Log res
      const res$ = rr$.pipe(skip(1), tap(log));

      return merge(req$, res$);
    });

    api.get('api/resource').subscribe(
      val => values.push(val),
      undefined,
      () => {
        expect(values.length).toBe(2);
        const [req, res] = values;

        expect(log).toHaveBeenCalledTimes(2);
        expect(log).toHaveBeenNthCalledWith(1, req);
        expect(log).toHaveBeenNthCalledWith(2, res);

        done();
      },
    );
  });

  it('maps `res` to json and keeps `req` in stream', done => {
    const values = [];

    fetch.mockResponse('{"foo": "bar"}');

    api.use(next => req => {
      const rr$ = next(req);

      // Req
      const req$ = rr$.pipe(take(1));

      // Res
      const res$ = rr$.pipe(
        skip(1),
        switchMap(res => from(res.json())),
      );

      return merge(req$, res$);
    });

    api.get('api/resource').subscribe(
      val => values.push(val),
      undefined,
      () => {
        expect(values.length).toBe(2);
        const [req, res] = values;

        expect(req.url).toBe('http://example.org/api/resource');
        expect(res).toEqual({ foo: 'bar' });

        done();
      },
    );
  });

  it('logs req in after middleware (res)', done => {
    const values = [];
    const log = jest.fn();

    api.use(next => oldReq => {
      const req = new Request(oldReq, { method: 'POST' });

      const rr$ = next(req);

      // Req
      const req$ = rr$.pipe(
        take(1),
        tap(req => log(req)),
      );

      // Res
      const res$ = rr$.pipe(skip(1));

      return merge(req$, res$);
    });

    api.get('api/resource').subscribe(
      val => values.push(val),
      undefined,
      () => {
        expect(values.length).toBe(2);
        const [req, res] = values;

        expect(req.method).toBe('POST');
        expect(log).toHaveBeenLastCalledWith(req);

        done();
      },
    );
  });
});
