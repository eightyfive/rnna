import { EMPTY } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

const reCreating = /\/creating$/;
const reReading = /\/reading$/;
const reUpdating = /\/updating$/;
const reDeleting = /\/deleting$/;
const reIndexing = /\/indexing$/;

const do$ = (action$, state$, services) =>
  action$.pipe(
    filter(({ meta }) => meta && meta.resource),
    switchMap(({ type, payload, meta: { id, resource } }) => {
      const service = services[resource];

      if (reCreating.test(type)) {
        return service.doCreate(payload);
      }

      if (reReading.test(type)) {
        return service.doRead(payload);
      }

      if (reUpdating.test(type)) {
        return service.doUpdate(id, payload);
      }

      if (reDeleting.test(type)) {
        return service.doDelete(id, payload);
      }

      if (reIndexing.test(type)) {
        return service.doIndex(payload);
      }

      return EMPTY;
    }),
  );

return [do$];
