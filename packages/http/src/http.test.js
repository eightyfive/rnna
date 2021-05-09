import { merge } from 'rxjs';
import { map, skip, tap } from 'rxjs/operators';
import mock from 'xhr-mock';

import Http from './http';

let api;

beforeEach(() => {
  jest.clearAllMocks();
  mock.setup();

  api = new Http({
    url: 'http://example.org',
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

afterEach(() => mock.teardown());

describe('Http', () => {
  it('logs `req` & `res`', done => {
    const log = jest.fn();

    api.use(next => req$ => {
      const res$ = next(req$);

      return merge(req$.pipe(tap(log)), res$.pipe(tap(log))).pipe(skip(1));
    });

    mock.get('http://example.org/api/resource', { status: 200 });

    api.get('api/resource').subscribe(res => {
      expect(log).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenNthCalledWith(2, res);

      done();
    });
  });

  it('changes `req`', done => {
    const log = jest.fn();

    api.use(next => req$ => {
      return next(
        req$.pipe(
          tap(req => log(req.method)),
          map(req => ({ ...req, method: 'POST' })),
          tap(req => log(req.method)),
        ),
      );
    });

    mock.post('http://example.org/api/resource', { status: 200 });

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

    mock.get('http://example.org/api/resource', { status: 200 });

    api.get('api/resource').subscribe(
      val => values.push(val),
      undefined,
      () => {
        expect(values.length).toBe(2);
        const [req, res] = values;

        expect(req.method).toBe('GET');
        expect(req.headers['Content-Type']).toBe('application/json');
        expect(req.url).toBe('http://example.org/api/resource');

        expect(res.status).toBe(200);

        done();
      },
    );
  });

  it('throws error', done => {
    mock.post('http://example.org/api/resource', {
      status: 422,
      reason: 'Unprocessable Entity',
      body: '{"foo":"bar"}',
    });

    api.post('api/resource').subscribe(
      () => {},
      err => {
        expect(err.name).toBe('AjaxError');
        expect(err.status).toBe(422);
        expect(err.response).toEqual({ foo: 'bar' });

        done();
      },
    );
  });
});
