import type { LeanInstance } from '../api.js'

/*
This file provides basic functionality to open, modify, and close a file in the Lean server.
It implements a queue which ensures that every instance only has one active check.
*/

const queues = new Map<string, Promise<unknown>>()

export function withQueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const prev = queues.get(key) ?? Promise.resolve()
  const next = prev.then(task, task)
  queues.set(
    key,
    next.catch(() => {}),
  )
  return next
}

/** A document kept open in the Lean server */
interface OpenDoc {
  uri: string
  version: number
  text: string
}

const MAX_OPEN_DOCS = Math.max(1, Number(process.env.LEAN_MAX_OPEN_DOCS) || 1)

/** All currently open documents.
 * Inside the map, the most recently used document always comes last
 */
const openDocs = new Map<string, Map<string, OpenDoc>>()

/** Forgets the open documents of an instance whose process has exited */
export function forgetInstanceDocs(instanceId: string): void {
  openDocs.delete(instanceId)
  queues.delete(instanceId)
}

/** Close a document */
export async function closeDoc(
  instance: LeanInstance,
  uri: string,
): Promise<void> {
  const docs = openDocs.get(instance.id)
  if (!docs) return
  docs.delete(uri)
  await instance.client
    .notify('textDocument/didClose', { textDocument: { uri } })
    .catch(() => {})
}

/** Opens a new document or updates its content if already open */
export async function syncDoc(
  instance: LeanInstance,
  uri: string,
  text: string,
): Promise<OpenDoc> {
  let docs = openDocs.get(instance.id)
  if (!docs) {
    docs = new Map()
    openDocs.set(instance.id, docs)
  }
  let doc = docs.get(uri)
  if (!doc) {
    doc = { uri, version: 1, text }
    await instance.client.notify('textDocument/didOpen', {
      textDocument: { uri, languageId: 'lean4', version: doc.version, text },
    })
  } else if (doc.text !== text) {
    doc.version++
    doc.text = text
    await instance.client.notify('textDocument/didChange', {
      textDocument: { uri, version: doc.version },
      contentChanges: [{ text }],
    })
  }
  // move file to the end and delete files which haven't been used the longest
  docs.delete(uri)
  docs.set(uri, doc)
  for (const oldUri of docs.keys()) {
    if (docs.size <= MAX_OPEN_DOCS) break
    await closeDoc(instance, oldUri)
  }
  return doc
}
