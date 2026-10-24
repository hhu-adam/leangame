# API

| Endpoint                                     | Kind       | Description                                                        |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `/api/lean/start/:owner/:game`               | POST       | starts a lean instance for the specified game                      |
| `/api/lean/instances/:id`                    | GET/DELETE | get information about an existing instance or delete that instance |
| `/api/lean/instances/:id/check`              | POST       | submit a proof for a level                                         |
| `/api/lean/instances/count`                  | GET        | number of active instances per game                                |
| `/api/import/:owner/:repo/trigger`           | POST       | start importing a game from GitHub                                 |
| `/api/import/:owner/:repo`                   | GET        | get the status of the import                                       |
| `/api/games`                                 | GET        | games for the landing page                                         |
| `/api/data/:owner/:game/game`                | GET        | game info                                                          |
| `/api/data/:owner/:game/inventory`           | GET        | inventory of the game                                              |
| `/api/data/:owner/:game/level/:world/:level` | GET        | info about a level                                                 |
| `/api/data/:owner/:game/doc/:kind/:name`     | GET        | doc entry                                                          |
| `/api/i18n/:owner/:game/:lang`               | GET        | translations of the game in specified language                     |
