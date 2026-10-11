# Server

## Environment variables

| Name        | Type                          | Description                                                                                                                                              | Default      |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `NODE_ENV`  | `development` or `production` | when `development` is activated, some features useful for local development might be active                                                              | `production` |
| `NO_BWRAP`  | boolean                       | starts the Lean server without bubblewrap container. You should provide your own sandbox instead to avoid arbitrary user code being run on your machine! | `false`      |
| `GAMES_DIR` | string                        | the path to the folder containing the games, relative from the `server/` folder.                                                                         | `games`      |
