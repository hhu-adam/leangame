import './i18n'
import { useAtomValue } from 'jotai'

import { NotFound } from './ErrorPage/NotFound'
import { useLanguageInUrl } from './hooks/useLanguageInUrl'
import { useTheme } from './hooks/useTheme'
import { LandingPage } from './LandingPage/LandingPage'
import { AppBar } from './Navigation/AppBar'
import { GamePage } from './pages/GamePage'
import { ImpressumPage } from './pages/ImpressumPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { pathSegmentsAtom } from './state/location-atoms'

export function App() {
  useLanguageInUrl()
  useTheme()
  return (
    <>
      <AppBar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Page />
      </main>
    </>
  )
}

/** The page for the current path */
function Page() {
  const segments = useAtomValue(pathSegmentsAtom)

  if (segments.length === 0) return <LandingPage />
  if (segments.length === 1) {
    switch (segments[0]) {
      case 'impressum':
        return <ImpressumPage />
      case 'privacy':
        return <PrivacyPage />
      case 'preferences':
        return <PreferencesPage />
    }
  }
  if (segments.length === 2) return <GamePage />
  return <NotFound />
}
