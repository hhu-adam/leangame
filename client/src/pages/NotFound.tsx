import { useAtomValue } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'

import { ErrorMessage, IssueLink } from '../components/ErrorMessage'
import { locationAtom } from '../state/location'

/** The 404 page */
export function NotFound() {
  const { t } = useTranslation()
  const { pathname = '/' } = useAtomValue(locationAtom)
  return (
    <ErrorMessage>
      <h2>{t('notFound.title')}</h2>
      <p>
        <Trans
          i18nKey="notFound.description"
          values={{ pathname }}
          components={{ code: <code /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="notFound.createIssue"
          components={{ issueLink: <IssueLink /> }}
        />
      </p>
    </ErrorMessage>
  )
}
