import { atomWithQuery } from 'jotai-tanstack-query'

// keep in sync with `LegalConfig` in `server/src/config.ts`

/**
 * Text which may differ per language, either one string for all languages or e.g.
 * `{ "en": "Germany", "de": "Deutschland" }`. Missing languages fall back to `en`.
 */
export type Localized = string | Partial<Record<string, string>>

/** Contact information and legal texts of the operator, from `server/config.json` */
export interface LegalInfo {
  contact?: {
    name: string
    address: Localized[]
    phone?: string
    url?: string
    technicalEmail?: string
  }
  impressum?: {
    legalForm?: Localized
    vatId?: string
    link?: { label: Localized; url: string }
  }
  privacy?: {
    serverLocation?: Localized
  }
}

export const legalAtom = atomWithQuery<LegalInfo>(() => ({
  queryKey: ['legal'],
  queryFn: async () => {
    const res = await fetch('/api/legal')
    if (!res.ok) throw new Error(`/api/legal: ${res.status} ${res.statusText}`)
    return res.json()
  },
  staleTime: Infinity,
}))

/** The text of `localized` in the language `lng`, falling back to English */
export function localize(localized: Localized, lng: string): string {
  if (typeof localized === 'string') return localized
  return localized[lng] ?? localized.en ?? Object.values(localized)[0] ?? ''
}
