import { of } from 'rxjs';

export const ofAction = (type, payload) => of({ type, payload });
