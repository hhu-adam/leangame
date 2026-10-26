import { useAtomValue } from 'jotai'
import { ReactCountryFlag } from 'react-country-flag'
import { twMerge } from 'tailwind-merge'

import config from '../config.json'
import { preferencesAtom } from '../state/preferences-atoms'

/** The flag of a language if enabled in the preferences, otherwise its ISO code */
export function LanguageIcon({
  iso,
  title,
  className,
}: {
  iso: string
  title?: string
  /** for the ISO code, e.g. to remove its fixed width */
  className?: string
}) {
  const { useFlags } = useAtomValue(preferencesAtom)
  const flag = config.languages.find(l => l.iso === iso)?.flag
  if (useFlags && flag)
    return <ReactCountryFlag countryCode={flag} svg title={title} />
  return (
    <span
      className={twMerge(
        'inline-block w-[1.5em] text-center leading-none lowercase',
        className,
      )}
      title={title}
    >
      {iso}
    </span>
  )
}
