import { throwError } from 'rxjs/observable/throwError';
import { catchError } from 'rxjs/operators/catchError';

import Http from '../index';
import error from './error';

let api;

beforeEach(() => {
  api = new Http();
  api.use(error);
});

describe('error', () => {
  it('maps error', done => {
    fetch.mockResponse('{"foo": "bar"}', {
      status: 422,
      statusText: 'Unprocessable Entity',
    });

    api
      .get('http://example.org')
      .pipe(catchError(err => throwError(err)))
      .subscribe(
        () => {},
        err =>
          err.response.json().then(data => {
            expect(err.name).toBe('HttpError');
            expect(err.code).toBe(422);
            expect(err.message).toBe('Unprocessable Entity');
            expect(data).toEqual({ foo: 'bar' });

            done();
          }),
      );
  });
});
