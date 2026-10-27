import {
  faBars,
  faCircleInfo,
  faGear,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { routeAtom } from '../state/location-atoms'
import { langNavOpenAtom, navOpenAtom } from '../state/navigation-atoms'
import { mobileAtom } from '../state/preferences-atoms'
import { Dropdown } from './Dropdown'
import { GameNavigation } from './GameNavigation'
import { GithubIcon } from './GithubIcon'
import { LanguageButton, LanguageMenu } from './LanguageMenu'
import { NavButton } from './NavButton'
import { PageTitle, WorldTitle } from './PageTitle'

/** The navigation bar at the top of every page */
export function AppBar() {
  const { t } = useTranslation()
  const mobile = useAtomValue(mobileAtom)
  const isLandingPage = useAtomValue(routeAtom).page === 'landing'
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
            <LanguageButton open={langNavOpen} onToggle={toggleLangNav} />
            <NavButton
              icon={navOpen ? faXmark : faBars}
              title={navOpen ? t('appBar.closeMenu') : t('appBar.openMenu')}
              onClick={toggleNav}
            />
          </div>
          <Dropdown open={navOpen} onClose={closeAll}>
            <CommonMenuEntries />
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
            <LanguageButton open={langNavOpen} onToggle={toggleLangNav} />
            <NavButton
              icon={navOpen ? faXmark : faBars}
              title={navOpen ? t('appBar.closeMenu') : t('appBar.openMenu')}
              onClick={toggleNav}
            />
          </div>
          <Dropdown open={navOpen} onClose={closeAll}>
            <CommonMenuEntries />
          </Dropdown>
        </>
      )}
      <Dropdown open={langNavOpen} onClose={closeAll}>
        <LanguageMenu />
      </Dropdown>
    </header>
  )
}

/** The entries of the main menu which exist in both versions */
function CommonMenuEntries() {
  const { t } = useTranslation()
  return (
    <>
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
