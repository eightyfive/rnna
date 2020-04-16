import Http from '../index';
import logger from './logger';

const groupCollapsed = jest
  .spyOn(global.console, 'groupCollapsed')
  .mockImplementation();

const group = jest.spyOn(global.console, 'group').mockImplementation();

const log = jest.spyOn(global.console, 'log').mockImplementation();

let api;

beforeEach(() => {
  jest.clearAllMocks();
  fetch.resetMocks();

  api = new Http('http://example.org', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  api.use(logger);
});

describe('logger', () => {
  it('logs HTTP 200', done => {
    fetch.mockResponse('{"foo": "bar"}');

    api.get('api/resource').subscribe(res => {
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);

      expect(groupCollapsed).toHaveBeenCalledTimes(5);
      expect(log).toHaveBeenCalledTimes(8);

      done();
    });
  });

  it('logs HTTP 500', done => {
    fetch.mockResponse('{"foo": "bar"}', {
      status: 500,
      statusText: 'Unprocessable Entity',
    });

    api.get('api/resource').subscribe(res => {
      expect(res.ok).toBe(false);
      expect(res.status).toBe(500);

      expect(group).toHaveBeenCalledTimes(1);
      expect(groupCollapsed).toHaveBeenCalledTimes(4);
      expect(log).toHaveBeenCalledTimes(8);

      done();
    });
  });
});
