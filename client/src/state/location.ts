import { atom } from 'jotai'
import { atomWithLocation } from 'jotai-location'

/** The current URL, kept in sync with the browser history */
export const locationAtom = atomWithLocation()

/**
 * Splitting `/test/TestGame/TestWorld/1` into
 * ["test", "TestGame", "TestWorld", "1"]
 */
export const pathSegmentsAtom = atom(get => {
  const { pathname } = get(locationAtom)
  return pathname?.split('/').filter(Boolean) ?? []
})
