import { map } from 'rxjs/operators';

const response = next => req$ =>
  next(req$).pipe(map(res => res.response.data || res.response));

export default response;
