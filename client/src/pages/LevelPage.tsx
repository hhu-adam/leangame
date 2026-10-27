import { useTranslation } from 'react-i18next'

import { PanelLayout } from '../components/PanelLayout'

/** A level of a game at `/owner/repo/world/level`. TODO: the panels are still empty */
export function LevelPage() {
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
