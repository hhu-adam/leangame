import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { isMenuPage, locationAtom, routeAtom } from '../state/location-atoms'
import { lastPageAtom } from '../state/navigation-atoms'

/** Keeps `lastPageAtom` up to date */
export function useLastPage() {
  const location = useAtomValue(locationAtom)
  const route = useAtomValue(routeAtom)
  const setLastPage = useSetAtom(lastPageAtom)
  const menuPage = isMenuPage(route)
  const search = location.searchParams?.toString()
  const url = `${location.pathname ?? '/'}${search ? `?${search}` : ''}`

  useEffect(() => {
    if (!menuPage) setLastPage(url)
  }, [menuPage, url, setLastPage])
}
