
import { createContext } from 'react'

import type { Navigator } from './Navigator';

export type NavigatorContext = {
  navigator?: Navigator
}

export const NavigatorContext = createContext<NavigatorContext>({})

export const NavigatorProvider = NavigatorContext.Provider
export const NavigatorConsumer = NavigatorContext.Consumer
