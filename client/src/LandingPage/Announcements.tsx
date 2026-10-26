import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'

import { configAtom, localize } from '../state/config'
import { Section } from './Section'

/** The announcements from the server config, if any */
export function Announcements() {
  const { i18n } = useTranslation()
  const announcements = useAtomValue(configAtom).data?.announcements
  if (!announcements?.length) return null
  return (
    <Section>
      {announcements.map(({ title, message }, i) => (
        <article
          key={i}
          className="wrap-anywhere [&_p+p]:mt-3 [&+&]:mt-6 [&+&]:border-t [&+&]:border-[rgb(200,200,200)] [&+&]:pt-6"
        >
          <h2>{localize(title, i18n.language)}</h2>
          <Markdown>{localize(message, i18n.language)}</Markdown>
        </article>
      ))}
    </Section>
  )
}
