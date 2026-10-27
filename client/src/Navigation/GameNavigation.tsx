import {
  faArrowLeft,
  faArrowRight,
  faHome,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import {
  gameIdAtom,
  gamePath,
  levelIdAtom,
  routeAtom,
  worldIdAtom,
} from '../state/location-atoms'
import { gameInfoAtom } from '../state/query-atoms'
import { NavButton } from './NavButton'
import RotatingGlobe from './RotatingGlobe'

/**
 * Back and forward through a game: from the game overview `/owner/repo` to a world
 * `/owner/repo/world` and through its levels `/owner/repo/world/1`, `…/2`, ….
 * The world and its last level lead back to the game overview (home icon), everything
 * else back to the landing page (arrow and globe).
 */
export function GameNavigation() {
  const { t } = useTranslation()
  const route = useAtomValue(routeAtom)
  const gameId = useAtomValue(gameIdAtom)
  const worldId = useAtomValue(worldIdAtom)
  const levelId = useAtomValue(levelIdAtom)
  const { data: gameInfo } = useAtomValue(gameInfoAtom)

  if (route.page === 'landing') return null

  if (gameId !== undefined && worldId !== undefined && levelId !== undefined) {
    const worldSize = gameInfo?.worldSize?.[worldId]
    return (
      <>
        {levelId > 1 ? (
          <NavButton
            icon={faArrowLeft}
            title={t('appBar.previousLevel')}
            href={gamePath(gameId, worldId, levelId - 1)}
          />
        ) : (
          <NavButton
            icon={faArrowLeft}
            title={t('appBar.backToWorld')}
            href={gamePath(gameId, worldId)}
          />
        )}
        {worldSize !== undefined &&
          (levelId < worldSize ? (
            <NavButton
              icon={faArrowRight}
              title={t('appBar.nextLevel')}
              href={gamePath(gameId, worldId, levelId + 1)}
            />
          ) : (
            <NavButton
              icon={faHome}
              title={t('appBar.home')}
              href={gamePath(gameId)}
            />
          ))}
      </>
    )
  }

  if (gameId !== undefined && worldId !== undefined) {
    return (
      <>
        <NavButton
          icon={faHome}
          title={t('appBar.backToGame')}
          href={gamePath(gameId)}
        />
        <NavButton
          icon={faArrowRight}
          title={t('appBar.start')}
          href={gamePath(gameId, worldId, 1)}
        />
      </>
    )
  }

  return (
    <NavButton
      iconElement={
        <>
          <FontAwesomeIcon icon={faArrowLeft} />
          <RotatingGlobe />
        </>
      }
      title={t('appBar.backToLanding')}
      href="/"
    />
  )
}
