import { atomWithQuery } from 'jotai-tanstack-query'

import type { ApiClientConfig, ApiLocalized } from '../api'
import { fetchJson } from '../utils/fetch'

/** The public part of the server config */
export const configAtom = atomWithQuery(() => ({
  queryKey: ['config'],
  queryFn: () => fetchJson<ApiClientConfig>('/api/config'),
  staleTime: Infinity,
}))

/** The text of `localized` in the language `lng`, falling back to English */
export function localize(localized: ApiLocalized, lng: string): string {
  if (typeof localized === 'string') return localized
  return localized[lng] ?? localized.en ?? Object.values(localized)[0] ?? ''
}
