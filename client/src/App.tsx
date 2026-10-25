import './i18n'
import { useAtomValue } from 'jotai'

import { ImpressumPage } from './pages/ImpressumPage'
import { LandingPage } from './pages/LandingPage'
import { NotFound } from './pages/NotFound'
import { PrivacyPage } from './pages/PrivacyPage'
import { pathSegmentsAtom } from './state/location'

export function App() {
  const segments = useAtomValue(pathSegmentsAtom)

  if (segments.length === 0) return <LandingPage />
  if (segments.length === 1) {
    switch (segments[0]) {
      case 'impressum':
        return <ImpressumPage />
      case 'privacy':
        return <PrivacyPage />
    }
  }
  return <NotFound />
}
