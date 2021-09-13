import { filter, map } from 'rxjs/operators';

const response = next => req$ => {
  return next(req$).pipe(
    filter(({ responseType: type }) => type === 'json'),
    map(({ response }) => (response ? response.data || response : response)),
  );
};

export default response;
