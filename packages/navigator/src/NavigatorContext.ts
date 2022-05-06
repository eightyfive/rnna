
import { createContext } from 'react'

import type { Navigator } from './Navigator';

export type NavigatorContext = Navigator | null;

export const NavigatorContext = createContext<NavigatorContext>(null)

export const NavigatorProvider = NavigatorContext.Provider
export const NavigatorConsumer = NavigatorContext.Consumer
