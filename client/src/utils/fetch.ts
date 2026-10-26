/** The parsed json of `url`, throws if the server answers with an error */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

/** The URL of the game data `path` of the game `gameId`, which is `g/owner/repo` */
export function gameDataUrl(gameId: string, path: string): string {
  return `/api/data/${gameId.replace(/^g\//, '')}/${path}`
}
