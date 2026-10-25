import fs from 'node:fs/promises'
import path from 'node:path'

/*
The server's configuration file, by default `server/config.json`. It is read on every use,
so changes apply without a restart.
*/

const CONFIG_PATH = path.resolve(
  import.meta.dirname,
  '..',
  process.env.CONFIG_PATH ?? 'config.json',
)

/**
 * Text which may differ per language, either one string for all languages or e.g.
 * `{ "en": "Germany", "de": "Deutschland" }`. Missing languages fall back to `en`.
 */
export type Localized = string | Partial<Record<string, string>>

/** Contact information and legal texts of the operator, see `/api/legal` */
export interface LegalConfig {
  /** The responsible persons, shown in the impressum and the privacy policy */
  contact?: {
    name: string
    /** One entry per line */
    address: Localized[]
    phone?: string
    /** Link to further contact details */
    url?: string
    /** Email address for technical questions */
    technicalEmail?: string
  }
  impressum?: {
    /** e.g. the legal form, representation and supervisory authority of the operator */
    legalForm?: Localized
    /** VAT identification number according to §27a UStG */
    vatId?: string
    /** Link to the impressum of the operating institution */
    link?: { label: Localized; url: string }
  }
  privacy?: {
    /** Country where the server is located */
    serverLocation?: Localized
  }
}

export interface ServerConfig extends LegalConfig {
  /** The games listed first on the landing page, in this order */
  featuredGames: { owner: string; repo: string }[]
  /**
   * Whether `/api/games` also lists the imported games which are not featured.
   * `/stats/imports` always lists all imported games.
   */
  listImportedGames: boolean
}

const DEFAULT_CONFIG: ServerConfig = {
  featuredGames: [],
  listImportedGames: false,
}

/** The configuration, with defaults for a missing file or missing fields */
export async function readConfig(): Promise<ServerConfig> {
  let content: string
  try {
    content = await fs.readFile(CONFIG_PATH, 'utf-8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return DEFAULT_CONFIG
    throw error
  }
  return {
    ...DEFAULT_CONFIG,
    ...(JSON.parse(content) as Partial<ServerConfig>),
  }
}
