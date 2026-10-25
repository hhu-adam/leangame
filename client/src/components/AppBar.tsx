import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft,
  faBars,
  faCircleInfo,
  faGear,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtom, useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { ReactCountryFlag } from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

import config from '../config.json'
import { setLanguage } from '../i18n'
import { pathSegmentsAtom } from '../state/location'
import { langNavOpenAtom, navOpenAtom } from '../state/navigation-atoms'
import { mobileAtom, preferencesAtom } from '../state/preferences-atoms'
import { Link } from './Link'

// TODO: most buttons have no action yet, they are placeholders for the game pages

type NavButtonProps = {
  icon?: IconDefinition
  /** shown instead of `icon` */
  iconElement?: ReactNode
  /** shown next to the icon */
  text?: string
  /** tooltip, also the accessible name if there is no `text` */
  title: string
  /** a page of the client to navigate to */
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

/** A button in the app bar or in one of its menus */
function NavButton({
  icon,
  iconElement,
  text,
  title,
  href,
  onClick,
  disabled = false,
  className,
}: NavButtonProps) {
  const classes = twMerge(
    'inline-flex cursor-pointer items-center gap-2 rounded px-3 py-2 whitespace-nowrap hover:bg-white/15 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent',
    className,
  )
  const content = (
    <>
      {iconElement ?? (icon && <FontAwesomeIcon icon={icon} />)}
      {text}
    </>
  )
  if (href && !disabled) {
    return (
      <Link className={classes} href={href} title={title} onClick={onClick}>
        {content}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className={classes}
      title={title}
      aria-label={text ? undefined : title}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

/** A dropdown below the app bar, aligned to the right */
function Dropdown({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    // every click inside, e.g. on a menu entry, closes the dropdown
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="absolute top-full right-0 z-10 flex-col rounded-bl-lg bg-primary py-1 shadow-lg *:justify-start *:rounded-none"
      onClick={onClose}
    >
      {children}
    </div>
  )
}

/** The flag of a language if enabled in the preferences, otherwise its ISO code */
function LanguageIcon({ iso }: { iso: string }) {
  const { useFlags } = useAtomValue(preferencesAtom)
  const flag = config.languages.find(l => l.iso === iso)?.flag
  if (useFlags && flag) return <ReactCountryFlag countryCode={flag} svg />
  return (
    <span className="inline-block w-[1.5em] text-center leading-none lowercase">
      {iso}
    </span>
  )
}

/** The current language, opening the language menu */
function LanguageButton({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  const { t, i18n } = useTranslation()
  return (
    <NavButton
      icon={open ? faXmark : undefined}
      iconElement={open ? undefined : <LanguageIcon iso={i18n.language} />}
      title={
        open ? t('appBar.closeLanguageMenu') : t('appBar.openLanguageMenu')
      }
      onClick={onToggle}
    />
  )
}

/** All languages to choose from */
function LanguageMenu() {
  return config.languages.map(({ iso, name }) => (
    <NavButton
      key={iso}
      iconElement={<LanguageIcon iso={iso} />}
      text={name}
      title={name}
      onClick={() => setLanguage(iso)}
    />
  ))
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

/** The navigation bar at the top of every page */
export function AppBar() {
  const { t } = useTranslation()
  const mobile = useAtomValue(mobileAtom)
  const isLandingPage = useAtomValue(pathSegmentsAtom).length === 0
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

  return (
    <header className="relative flex shrink-0 items-center justify-between gap-2 bg-primary px-2 py-1 text-white">
      {mobile ? (
        <>
          {/* MOBILE VERSION */}
          <div className="flex items-center">
            {!isLandingPage && (
              <NavButton
                icon={faArrowLeft}
                title={t('appBar.backToLanding')}
                href="/"
              />
            )}
          </div>
          <div className="flex items-center">
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
          <div className="flex items-center">
            {!isLandingPage && (
              <NavButton
                icon={faArrowLeft}
                title={t('appBar.backToLanding')}
                href="/"
              />
            )}
          </div>
          <div className="flex items-center">
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
