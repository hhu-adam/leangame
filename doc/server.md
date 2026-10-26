# Server

## Environment variables

| Name                     | Type                          | Description                                                                                                                                                                                                                    | Default                  |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `NODE_ENV`               | `development` or `production` | when `development` is activated, some features useful for local development might be active                                                                                                                                    | `production`             |
| `NO_BWRAP`               | boolean                       | starts the Lean server without bubblewrap container. You should provide your own sandbox instead to avoid arbitrary user code being run on your machine!                                                                       | `false`                  |
| `PORT`                   | number                        | port of the server                                                                                                                                                                                                             | `8000`                   |
| `HOST`                   | string                        | address the server listens on, e.g. `127.0.0.1` to only accept connections from a reverse proxy on the same machine                                                                                                            | all addresses            |
| `GAMES_DIR`              | string                        | the path to the folder containing the games, relative from the `server/` folder.                                                                                                                                               | `games`                  |
| `LEAN_MAX_OPEN_DOCS`     | number                        | how many level documents an instance keeps open between checks. Each open document is a separate Lean worker process with the game's imports loaded; the least recently checked document is closed when the limit is exceeded. | `1`                      |
| `LEAN_CHECK_TIMEOUT_MS`  | number                        | maximal duration of a proof check in milliseconds. A check taking longer is answered with `504` and its Lean worker is stopped.                                                                                                | `120000`                 |
| `LEAN_IDLE_MINUTES`      | number                        | an instance without a check or keepalive for this many minutes is stopped                                                                                                                                                      | `5`                      |
| `LEANGAME_GITHUB_TOKEN`  | string                        | GitHub token used to download the artifacts of imported games. Required for imports.                                                                                                                                           | –                        |
| `LEANGAME_GITHUB_USER`   | string                        | user agent sent to GitHub                                                                                                                                                                                                      | `leangame`               |
| `GITHUB_API_URL`         | string                        | GitHub API base URL, e.g. for GitHub Enterprise                                                                                                                                                                                | `https://api.github.com` |
| `IMPORT_MAX_DOWNLOAD_MB` | number                        | maximal size of a downloaded artifact                                                                                                                                                                                          | `8192`                   |
| `IMPORT_MAX_UNPACKED_MB` | number                        | maximal unpacked size of an artifact                                                                                                                                                                                           | `40960`                  |
| `DATABASE_PATH`          | string                        | path of the SQLite database, relative from the `server/` folder                                                                                                                                                                | `data/leangame.db`       |
| `CONFIG_PATH`            | string                        | path of the config file, relative from the `server/` folder                                                                                                                                                                    | `config.json`            |
| `STATS_IDLE_MINUTES`     | number                        | a gap between two checks longer than this counts as a break in the play statistics, see [statistics](stats.md)                                                                                                                 | `20`                     |

## Configuration

`server/config.json` (see `CONFIG_PATH`) is read on every request, so changes apply without a restart. All fields are optional.

| Field               | Type                                         | Description                                                                                                 | Default |
| ------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `featuredGames`     | `{ owner: string, repo: string }[]`          | games listed first by `/api/games`, in this order. Featured games which are not imported are skipped.       | `[]`    |
| `listImportedGames` | boolean                                      | whether `/api/games` also lists all other imported games. `/stats/imports` always lists all imported games. | `false` |
| `announcements`     | `{ title: localized, message: localized }[]` | shown at the top of the landing page, `message` in Markdown                                                 | `[]`    |
| `contact`           | object                                       | contact information shown in the impressum and the privacy policy, see below                                | –       |
| `impressum`         | object                                       | further content of the impressum, see below                                                                 | –       |
| `privacy`           | object                                       | further content of the privacy policy, see below                                                            | –       |

`announcements`, `contact`, `impressum` and `privacy` are served to the client by `/api/config`. Fields marked as _localized_ are either one string for all
languages or an object like `{ "en": "Germany", "de": "Deutschland" }`, where missing languages fall back
to `en`.

| Field                    | Type                                | Description                                                          |
| ------------------------ | ----------------------------------- | -------------------------------------------------------------------- |
| `contact.name`           | string                              | the responsible persons                                              |
| `contact.address`        | localized[]                         | address, one entry per line                                          |
| `contact.phone`          | string                              | phone number                                                         |
| `contact.url`            | string                              | link to further contact details                                      |
| `contact.technicalEmail` | string                              | email address for technical questions                                |
| `impressum.legalForm`    | localized                           | legal form, representation and supervisory authority of the operator |
| `impressum.vatId`        | string                              | VAT identification number (according to §27a UStG)                   |
| `impressum.link`         | `{ label: localized, url: string }` | link to the impressum of the operating institution                   |
| `privacy.serverLocation` | localized                           | country where the server is located                                  |

In development mode, `/api/games` also lists the `GameSkeleton` of this repository, with owner `test` and repo `testgame`, and the local games: the folders next to this repository with a `.lake/gamedata/game.json`, with owner `local`.
