import { from, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

export const createMapApi = createType => request => source =>
  source.pipe(
    switchMap(action => {
      const payload = action.payload || action;
      const res$ = request(payload);

      return res$.pipe(
        filter(
          ([res, req]) =>
            res.headers.get('Content-Type') === 'application/json',
        ),
        mapApiActions(createType),
        catchApiError(createType),
      );
    }),
  );

const mapApiActions = createType => source =>
  source.pipe(
    switchMap(([res, req]) =>
      of([res, req]).pipe(
        mapApiResponse(createType),
        startWithAction(createType(req.method, req.url, 202)),
      ),
    ),
  );

const mapApiResponse = createType => source =>
  source.pipe(
    switchMap(([res, req]) =>
      from(
        res.json().then(json => ({
          type: createType(req.method, req.url, res.status),
          payload: json.data || json,
        })),
      ),
    ),
  );

const catchApiError = createType => source =>
  source.pipe(
    catchError(err =>
      of(err).pipe(
        filter(err => err.response),
        switchMap(err =>
          from(
            err.response.json().then(data => {
              const req = err.request;
              const res = err.response;

              err.data = data;

              return {
                type: createType(req.method, req.url, res.status),
                error: true,
                payload: err,
              };
            }),
          ),
        ),
      ),
    ),
  );
