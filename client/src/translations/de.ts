import type { DeepPartialTranslation } from '../utils/DeepPartialTranslation'
import { en } from './en'

export const de: DeepPartialTranslation<typeof en> = {
  helloWorld: 'Hallo Welt',
  errorPage: {
    title: 'Oops!',
    description: 'Etwas Unerwartetes ist passiert:',
    createIssue:
      'Bitte erstelle ein Issue im <issueLink/>.',
  },
  notFound: {
    title: 'Diese Seite wurde nicht gefunden',
    description:
      '<code>(404)</code> Die Seite <code>{{pathname}}</code> scheint nicht zu existieren.',
    createIssue:
      'Falls Du denkst, dass es sie geben sollte, erstelle bitte ein Issue im <issueLink/>.',
  },
} as const
