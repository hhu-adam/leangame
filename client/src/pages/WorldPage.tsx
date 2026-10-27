import { useTranslation } from 'react-i18next'

import { PanelLayout } from '../components/PanelLayout'

/** A world of a game at `/owner/repo/world`. TODO: the panels are still empty */
export function WorldPage() {
  const { t } = useTranslation()
  return (
    <PanelLayout
      leftTitle={t('game.introduction')}
      rightTitle={t('game.inventory')}
      left={null}
      center={null}
      right={null}
    />
  )
}
