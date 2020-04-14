import { AppState } from 'react-native';
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const fromAppState = source =>
  source.pipe(
    switchMap(() => fromEvent(AppState, 'change'),
  );
