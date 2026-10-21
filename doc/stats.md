# Statistics

The server keeps track of a few anonymous usage statistics using an SQLite database located
under `server/data/leangame.db` (or `DATABASE_PATH`).

| Endpoint         | Kind | Description                             |
| ---------------- | ---- | --------------------------------------- |
| `/stats/imports` | GET  | import statistics of all imported games |
