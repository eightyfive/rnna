import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import Http from '../index';
import error from './error';

let api;

beforeEach(() => {
  api = new Http();
  api.use(error);
});

describe('error', () => {
  it('maps error', done => {
    const values = [];
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
            expect(err.name).toBe('HTTPError');
            expect(err.code).toBe(422);
            expect(err.message).toBe('Unprocessable Entity');
            expect(data).toEqual({ foo: 'bar' });

            done();
          }),
      );
  });
});
