import { atom } from 'jotai'

import { mobileAtom } from './preferences-atoms'

/**
 * Whether a side panel of `PanelLayout` is open. By default the side panels are open on
 * desktop and closed on mobile. A choice of the player only lasts until the layout
 * switches between desktop and mobile.
 */
function panelOpenAtom() {
  const choiceAtom = atom<{ mobile: boolean; open: boolean } | null>(null)
  return atom(
    get => {
      const mobile = get(mobileAtom)
      const choice = get(choiceAtom)
      return choice?.mobile === mobile ? choice.open : !mobile
    },
    (get, set, open: boolean) => {
      set(choiceAtom, { mobile: get(mobileAtom), open })
    },
  )
}

export const leftPanelOpenAtom = panelOpenAtom()
export const rightPanelOpenAtom = panelOpenAtom()
