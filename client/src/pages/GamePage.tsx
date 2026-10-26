import { useTranslation } from 'react-i18next'

import { PanelLayout } from '../components/PanelLayout'

/** The overview of a game at `/owner/repo`. TODO: the panels are still empty */
export function GamePage() {
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
