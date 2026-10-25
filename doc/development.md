# Development

## Deploying GameSkeleton and GameServer

initial setup; add the desired remote once:

```bash
git remote add gameskeleton git@github.com:hhu-adam/GameSkeleton.git
git fetch gameskeleton
git remote add gameserver git@github.com:hhu-adam/GameServer.git
git fetch gameserver
```

Then, the content of `GameSkeleton/` and `server/lean` can be pushed to these repos with

```bash
git subtree push --prefix=GameSkeleton gameskeleton main
git subtree push --prefix=server/lean gameserver main
```

## Pushing Tags

The important tag for the users is the one on `gameserver`.

```
git tag v4.35.0
git push origin v4.35.0
git push gameserver "$(git subtree split --prefix=server/lean v4.35.0)":refs/tags/v4.35.0
```
