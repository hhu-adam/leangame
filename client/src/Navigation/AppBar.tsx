import {
  faBars,
  faCircleInfo,
  faGear,
  faLock,
  faLockOpen,
  faUnlock,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { routeAtom } from '../state/location-atoms'
import {
  gameInfoOpenAtom,
  langNavOpenAtom,
  navOpenAtom,
  rulesOpenAtom,
} from '../state/navigation-atoms'
import { mobileAtom } from '../state/preferences-atoms'
import { difficultyAtom } from '../state/progress-atoms'
import { Dropdown } from './Dropdown'
import { GameInfoPopup } from './GameInfoPopup'
import { GameNavigation } from './GameNavigation'
import { GithubIcon } from './GithubIcon'
import { LanguageButton, LanguageMenu } from './LanguageMenu'
import { NavButton } from './NavButton'
import { PageTitle, WorldTitle } from './PageTitle'
import { RulesPopup } from './RulesPopup'

/** The icon of the game rules button, showing how much the current rules lock */
function rulesIcon(difficulty: number) {
  if (difficulty <= 0) return faLockOpen
  if (difficulty === 1) return faUnlock
  return faLock
}

/** The navigation bar at the top of every page */
export function AppBar() {
  const { t } = useTranslation()
  const mobile = useAtomValue(mobileAtom)
  const route = useAtomValue(routeAtom)
  const isLandingPage = route.page === 'landing'
  const [rulesOpen, setRulesOpen] = useAtom(rulesOpenAtom)
  const difficulty = useAtomValue(difficultyAtom)
  const [navOpen, setNavOpen] = useAtom(navOpenAtom)
  const [langNavOpen, setLangNavOpen] = useAtom(langNavOpenAtom)

  // only one of the dropdowns is open at a time
  const toggleNav = () => {
    setNavOpen(!navOpen)
    setLangNavOpen(false)
  }
  const toggleLangNav = () => {
    setLangNavOpen(!langNavOpen)
    setNavOpen(false)
  }
  const closeAll = () => {
    setNavOpen(false)
    setLangNavOpen(false)
  }
  const [gameInfoOpen, setGameInfoOpen] = useAtom(gameInfoOpenAtom)
  const openGameInfo = () => {
    closeAll()
    setGameInfoOpen(true)
  }
  const openRules = () => {
    closeAll()
    setRulesOpen(true)
  }

  // only on the game overview, where the world tree depends on them
  const rulesButton = route.page === 'game' && (
    <NavButton
      icon={rulesIcon(difficulty)}
      title={t('rules.gameRules')}
      onClick={openRules}
    />
  )

  const githubButton = (
    <NavButton
      iconElement={<GithubIcon />}
      title={t('appBar.github')}
      href="https://github.com/leanprover-community/lean4game"
    />
  )

  return (
    <header className="relative flex shrink-0 items-center justify-between gap-2 bg-primary px-2 py-1 text-white">
      {mobile ? (
        <>
          {/* MOBILE VERSION */}
          <div className="flex flex-1 basis-0 items-center">
            <GameNavigation />
          </div>
          <PageTitle />
          <div className="flex flex-1 basis-0 items-center justify-end">
            {isLandingPage && githubButton}
            {rulesButton}
            <LanguageButton open={langNavOpen} onToggle={toggleLangNav} />
            <NavButton
              icon={navOpen ? faXmark : faBars}
              title={navOpen ? t('appBar.closeMenu') : t('appBar.openMenu')}
              onClick={toggleNav}
            />
          </div>
          <Dropdown open={navOpen} onClose={closeAll}>
            <CommonMenuEntries onGameInfo={openGameInfo} />
          </Dropdown>
        </>
      ) : (
        <>
          {/* DESKTOP VERSION */}
          <div className="flex flex-1 basis-0 items-center">
            <GameNavigation />
            <WorldTitle />
          </div>
          <PageTitle />
          <div className="flex flex-1 basis-0 items-center justify-end">
            {isLandingPage && githubButton}
            {rulesButton}
            <LanguageButton open={langNavOpen} onToggle={toggleLangNav} />
            <NavButton
              icon={navOpen ? faXmark : faBars}
              title={navOpen ? t('appBar.closeMenu') : t('appBar.openMenu')}
              onClick={toggleNav}
            />
          </div>
          <Dropdown open={navOpen} onClose={closeAll}>
            <CommonMenuEntries onGameInfo={openGameInfo} />
          </Dropdown>
        </>
      )}
      <Dropdown open={langNavOpen} onClose={closeAll}>
        <LanguageMenu />
      </Dropdown>
      {'gameId' in route && (
        <GameInfoPopup
          open={gameInfoOpen}
          onClose={() => setGameInfoOpen(false)}
        />
      )}
      {route.page === 'game' && (
        <RulesPopup open={rulesOpen} onClose={() => setRulesOpen(false)} />
      )}
    </header>
  )
}

/** The entries of the main menu which exist in both versions */
function CommonMenuEntries({ onGameInfo }: { onGameInfo: () => void }) {
  const { t } = useTranslation()
  const inGame = 'gameId' in useAtomValue(routeAtom)
  return (
    <>
      {inGame && (
        <NavButton
          icon={faCircleInfo}
          text={t('appBar.gameInfo')}
          title={t('appBar.gameInfoTitle')}
          onClick={onGameInfo}
        />
      )}
      <NavButton
        icon={faCircleInfo}
        text={t('appBar.impressum')}
        title={t('appBar.impressum')}
        href="/impressum"
      />
      <NavButton
        icon={faCircleInfo}
        text={t('appBar.privacy')}
        title={t('appBar.privacy')}
        href="/privacy"
      />
      <NavButton
        icon={faGear}
        text={t('appBar.preferences')}
        title={t('appBar.preferences')}
        href="/preferences"
      />
    </>
  )
}
