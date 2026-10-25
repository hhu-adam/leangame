import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { ContactInfo, LegalPage } from '../components/LegalPage'
import { legalAtom, localize } from '../state/legal'

export function ImpressumPage() {
  return <LegalPage Content={Impressum} />
}

function Impressum({ lng }: { lng: string }) {
  const { t } = useTranslation(undefined, { lng })
  const impressum = useAtomValue(legalAtom).data?.impressum
  return (
    <>
      <h2>{t('impressum.title')}</h2>
      <ContactInfo lng={lng} />
      {impressum?.legalForm && (
        <p>
          <strong>{t('impressum.legalForm')}</strong>
          <br />
          {localize(impressum.legalForm, lng)}
        </p>
      )}
      {impressum?.vatId && (
        <p>
          <strong>{t('impressum.vatId')}</strong>
          <br />
          {t('impressum.vatIdBasis')}
          <br />
          {impressum.vatId}
        </p>
      )}
      {impressum?.link && (
        <p>
          <a href={impressum.link.url} target="_blank" rel="noreferrer">
            {localize(impressum.link.label, lng)}
          </a>
        </p>
      )}
    </>
  )
}
