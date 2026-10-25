import './i18n'
import { useAtomValue } from 'jotai'

import { AppBar } from './components/AppBar'
import { ImpressumPage } from './pages/ImpressumPage'
import { LandingPage } from './pages/LandingPage'
import { NotFound } from './pages/NotFound'
import { PrivacyPage } from './pages/PrivacyPage'
import { pathSegmentsAtom } from './state/location'

export function App() {
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
    }
  }
  return <NotFound />
}
