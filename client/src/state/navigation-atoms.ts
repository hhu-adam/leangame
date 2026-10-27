import { atom } from 'jotai'

/** Controls if the expandable menu in the navigation bar is open or closed */
export const navOpenAtom = atom(false)

export const openNavAtom = atom(null, (_get, set) => {
  set(navOpenAtom, true)
})

export const closeNavAtom = atom(null, (_get, set) => {
  set(navOpenAtom, false)
})

/** The state of the language dropdown */
export const langNavOpenAtom = atom(false)

export const openLangNavAtom = atom(null, (_get, set) => {
  set(langNavOpenAtom, true)
})

export const closeLangNavAtom = atom(null, (_get, set) => {
  set(langNavOpenAtom, false)
})

/** The state of the popup with the info about the game */
export const gameInfoOpenAtom = atom(false)

/** The state of the popup with the game rules */
export const rulesOpenAtom = atom(false)

/**
 * The last page which is not one of the pages of the menu, e.g. `/g/owner/repo?lang=de`.
 * The menu's pages lead back to it, or to the landing page if they were opened directly.
 */
export const lastPageAtom = atom('/')
