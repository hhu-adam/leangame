# Setup

How to run Lean Games on a server: pm2 keeps the Node server running on `127.0.0.1:8000`,
nginx serves the built client and forwards the API to the Node server.

## Install bubblewrap (bwrap)

```
sudo apt-get install bubblewrap
```

## nginx

nginx handles HTTPS and anonymized logging and forwards every request to the Node server. The
Node server answers the API and, in production, also serves the built client: `npm run build`
writes it to `client/dist` (see `server/src/client.ts`). Vite is only used to build the client
and doesn't run in production. As nginx doesn't know about individual paths, its configuration
doesn't need to change when endpoints are added or removed.

Install nginx:

```
sudo apt update
sudo apt install nginx
```

The configuration is in [`deploy/nginx/leangame.conf`](../deploy/nginx/leangame.conf). Adjust
`server_name` and the certificate paths, then enable it:

```
sudo unlink /etc/nginx/sites-enabled/default
sudo ln -s /path/to/leangame/deploy/nginx/leangame.conf /etc/nginx/sites-enabled/leangame.conf
sudo nginx -t
sudo nginx -s reload
```

Linking the file from the repository keeps the server's configuration up to date with
`git pull`; reload nginx after it changed. Copy the file to `/etc/nginx/sites-available/`
instead if you need local changes.

Notes on the configuration:

- **Privacy**: the access log anonymizes IP addresses, the error log is disabled because it
  would contain them, and the client's IP address isn't forwarded to the Node server.
- **Timeouts**: nginx waits up to 3 minutes for the Node server, longer than a proof check may
  take (`LEAN_CHECK_TIMEOUT_MS`, 2 minutes by default).
- **Other sites**: the file contains the HTTP→HTTPS redirect as `default_server` and the `map`
  for anonymized IPs. If the server hosts further sites in other files, keep these only once.
- **Statistics**: to restrict `/stats` to certain addresses, uncomment the prepared `location`
  block.

The Node server should only be reachable through nginx, so `ecosystem.config.cjs` sets
`HOST=127.0.0.1`.

The Node server serves the client with suitable caching: the files in `client/dist/assets/`
have a hash in their name and are cached for a year; `index.html` is never cached, so a new
build is picked up immediately. Unknown paths outside `/api`, `/stats` and `/ping` get
`index.html`, so that reloading a page of the client works.

## Deploying an update

```
git pull
npm ci
npm run build
pm2 restart leangame
```

nginx doesn't need a reload.
