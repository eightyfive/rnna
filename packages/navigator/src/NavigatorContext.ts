
import { createContext } from 'react'

import type { NavigatorType } from './Navigator';

export type NavigatorContext = {
  navigator?: NavigatorType
}

export const NavigatorContext = createContext<NavigatorContext>({})

export const NavigatorProvider = NavigatorContext.Provider
export const NavigatorConsumer = NavigatorContext.Consumer
