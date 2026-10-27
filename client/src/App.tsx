import './i18n'
import { useAtomValue } from 'jotai'

import { NotFound } from './ErrorPage/NotFound'
import { GamePage } from './GamePage/GamePage'
import { useCanonicalGamePath } from './hooks/useCanonicalGamePath'
import { useLanguageInUrl } from './hooks/useLanguageInUrl'
import { useLastPage } from './hooks/useLastPage'
import { useTheme } from './hooks/useTheme'
import { LandingPage } from './LandingPage/LandingPage'
import { AppBar } from './Navigation/AppBar'
import { GameRoute } from './pages/GameRoute'
import { ImpressumPage } from './pages/ImpressumPage'
import { LevelPage } from './pages/LevelPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { WorldPage } from './pages/WorldPage'
import { routeAtom } from './state/location-atoms'

export function App() {
  useLanguageInUrl()
  useCanonicalGamePath()
  useLastPage()
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
  const route = useAtomValue(routeAtom)
  switch (route.page) {
    case 'landing':
      return <LandingPage />
    case 'impressum':
      return <ImpressumPage />
    case 'privacy':
      return <PrivacyPage />
    case 'preferences':
      return <PreferencesPage />
    case 'game':
      return (
        <GameRoute>
          <GamePage />
        </GameRoute>
      )
    case 'world':
      return (
        <GameRoute>
          <WorldPage />
        </GameRoute>
      )
    case 'level':
      return (
        <GameRoute>
          <LevelPage />
        </GameRoute>
      )
    case 'notFound':
    default:
      return <NotFound />
  }
}
