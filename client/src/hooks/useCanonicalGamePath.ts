import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { gamePath, locationAtom, routeAtom } from '../state/location-atoms'

/**
 * Replaces the URL of a game page by its canonical form: lowercase, as game and world
 * are case-insensitive, e.g. `/g/Owner/Repo/World/1` → `/g/owner/repo/world/1`, and old
 * URLs `/#/g/owner/repo/world/World/level/1` by the new ones.
 */
export function useCanonicalGamePath() {
  const [location, setLocation] = useAtom(locationAtom)
  const route = useAtomValue(routeAtom)
  const canonical =
    route.page === 'game'
      ? gamePath(route.gameId)
      : route.page === 'world'
        ? gamePath(route.gameId, route.world)
        : route.page === 'level'
          ? gamePath(route.gameId, route.world, route.levelId)
          : undefined
  const isCanonical =
    canonical === undefined ||
    (location.pathname === canonical && !location.hash)

  useEffect(() => {
    if (isCanonical || canonical === undefined) return
    setLocation(prev => ({ ...prev, pathname: canonical, hash: '' }), {
      replace: true,
    })
  }, [isCanonical, canonical, setLocation])
}
