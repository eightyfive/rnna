import { mergeMap } from 'rxjs/operators';

const dispatch = (action$, state$, { events }) =>
  action$.pipe(mergeMap(({ type, payload }) => events.dispatch(type, payload)));

export default [dispatch];
