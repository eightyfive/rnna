import { of } from 'rxjs';

export const ofAction = (type, payload, meta) => of({ type, payload, meta });
