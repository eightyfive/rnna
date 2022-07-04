// @ts-ignore
import { Navigation } from 'react-native-navigation';
import { useCallback, useEffect } from 'react';

export * from '@rnna/navigator';

export function useTopBar(id: string, cb: () => void) {
  const handler = useCallback(
    ({ buttonId }: { buttonId: string }) => {
      if (buttonId === id) {
        cb();
      }
    },
    [cb, id],
  );

  useEffect(() => {
    const listener = Navigation.events().registerNavigationButtonPressedListener(
      handler,
    );

    return () => {
      listener.remove();
    };
  }, [handler]);
}
