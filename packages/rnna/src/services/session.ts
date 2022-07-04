// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Session {
  // State
  isLoading: boolean;
  token: string;

  // Actions
  init: (token: string) => void;
  start: (token: string) => void;
  stop: () => void;
}

type Options = {
  onInit?: (token: string) => void;
  onStart?: (token: string) => void;
  onStop?: () => void;
};

export function createSession(
  name: string,
  { onInit, onStart, onStop }: Options,
) {
  const useSession = create<Session>()(
    persist(
      set => ({
        // State
        isLoading: true,
        token: '',

        // Actions
        init(token) {
          if (onInit) {
            onInit(token);
          }

          set({ isLoading: false, token });
        },

        start(token: string) {
          if (onStart) {
            onStart(token);
          }

          set({ token });
        },

        stop() {
          if (onStop) {
            onStop();
          }

          set({ token: '' });
        },
      }),
      {
        name,
        getStorage: () => AsyncStorage,
        onRehydrateStorage: () => state => {
          state?.init(state?.token);
        },
      },
    ),
  );

  return useSession;
}
