import type { DeepPartialTranslation } from '../utils/DeepPartialTranslation'
import { en } from './en'

export const de: DeepPartialTranslation<typeof en> = {
  helloWorld: 'Hallo Welt',
} as const
