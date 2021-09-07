import { map } from 'rxjs/operators';

const response = next => req$ => {
  return next(req$).pipe(map(res => res.response.data || res.response));
};

export default response;
