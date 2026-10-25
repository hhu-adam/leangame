# Development

## Deploying GameSkeleton

initial setup; add the desired remote once:

```bash
git remote add gameskeleton git@github.com:hhu-adam/GameSkeleton.git
git fetch gameskeleton
```

Then, the content of `GameSkeleton/` can be pushed to the repo with

```bash
git subtree push --prefix=GameSkeleton gameskeleton main
```
