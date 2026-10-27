import { useTranslation } from 'react-i18next'

import type { ApiGameInfo } from '../api'
import { LanguageIcon } from '../components/LanguageIcon'
import { Link } from '../components/Link'
import { Markdown } from '../components/Markdown'
import { gamePath } from '../state/location-atoms'
import { useGameTranslation } from '../utils/translation'

/**
 * A game on the landing page. The styling is the one of the old client, in pixels as
 * there `1rem` was `16px`. The whole tile links to the game.
 */
export function GameTile({
  owner,
  repo,
  tile,
  settings,
}: ApiGameInfo & { tile: NonNullable<ApiGameInfo['tile']> }) {
  const { t } = useTranslation()
  const game = `${owner}/${repo}`
  const { t: gameT } = useGameTranslation(
    `g/${game}`,
    settings?.allowEmptyTranslations,
  )

  return (
    <article className="relative flex-col flex w-full max-w-125 cursor-pointer justify-between justify-self-center rounded-[20px] border border-[rgb(140,140,140)] text-left text-[16px] leading-normal tracking-normal text-(--text-h) shadow-[5px_5px_8px_rgb(140,140,140)] [&_a]:no-underline [&_a:not(.tile-link)]:relative [&_a:not(.tile-link)]:z-10 [&_a:not([class])]:text-[#1976d2]">
      <div>
        <div className="mx-2.5 pt-3.75 pb-1.25 text-2xl/normal font-bold">
          {/* covers the whole tile, links in the text are placed above it */}
          <Link
            className="tile-link text-inherit after:absolute after:inset-0"
            href={gamePath(`g/${game}`)}
          >
            {gameT(tile.title)}
          </Link>
        </div>
        <div className="mx-2.5 h-26 py-1.25">{gameT(tile.short)}</div>
        <div className="relative h-50 w-full bg-[linear-gradient(137deg,rgba(97,9,121,1)_0%,rgba(0,212,255,1)_100%)]">
          <img
            className="h-full w-full object-cover"
            src={`/api/data/${game}/${tile.image}`}
            alt=""
          />
        </div>

        <div className="mx-2.5">
          <Markdown game={game}>{gameT(tile.long)}</Markdown>
        </div>
      </div>
      <table className="mx-2.5 mt-1.25 mb-3.75 border-collapse [&_td]:py-1.25 [&_td:nth-child(even)]:text-right [&_tr]:border-y [&_tr]:border-[rgb(200,200,200)]">
        <tbody>
          <tr>
            <td title={t('landing.tile.prerequisitesTitle')}>
              {t('landing.tile.prerequisites')}
            </td>
            <td>
              <Markdown game={game}>
                {gameT(tile.prerequisites.join(', '))}
              </Markdown>
            </td>
          </tr>
          <tr>
            <td>{t('landing.tile.worlds')}</td>
            <td>{tile.worlds}</td>
          </tr>
          <tr>
            <td>{t('landing.tile.levels')}</td>
            <td>{tile.levels}</td>
          </tr>
          <tr>
            <td>{t('landing.tile.languages')}</td>
            <td className="[&>*+*]:ml-2">
              {tile.languages.map(iso => (
                <LanguageIcon
                  key={iso}
                  iso={iso}
                  className="inline w-auto text-left leading-[inherit]"
                />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}
