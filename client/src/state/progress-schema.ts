import { z } from 'zod'

import {
  DEFAULT_DIFFICULTY,
  type GameProgress,
  type WorldProgress,
} from './progress-types'

/*
The schema of the progress of a game, to validate uploaded files. It is lenient where
older versions of the game wrote less: missing lists and flags get their defaults.
*/

const selectionSchema = z.object({
  selectionStartLineNumber: z.number(),
  selectionStartColumn: z.number(),
  positionLineNumber: z.number(),
  positionColumn: z.number(),
})

const levelProgressSchema = z.object({
  code: z.string(),
  selections: z.array(selectionSchema).default([]),
  completed: z.boolean().default(false),
  help: z.array(z.number()).default([]),
})

/** `readIntro`, and the progress of the levels by their number */
const worldProgressSchema = z
  .object({ readIntro: z.boolean().default(false) })
  .catchall(levelProgressSchema)
  .superRefine((world, ctx) => {
    for (const key of Object.keys(world)) {
      if (key !== 'readIntro' && !/^\d+$/.test(key)) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: 'Expected a level number',
        })
      }
    }
  })
  .transform(world => world as WorldProgress)

export const gameProgressSchema = z.object({
  inventory: z.array(z.string()).default([]),
  difficulty: z.int().min(0).max(2).default(DEFAULT_DIFFICULTY),
  readIntro: z.boolean().default(false),
  data: z.record(z.string(), worldProgressSchema),
  typewriterMode: z.boolean().optional(),
}) satisfies z.ZodType<GameProgress>

/**
 * The progress in the JSON `text`, or a description of what is wrong with it, e.g.
 * `data.Addition.1.code: Invalid input: expected string, received undefined`
 */
export function parseGameProgress(
  text: string,
): { progress: GameProgress } | { error: string } {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch (error) {
    return { error: (error as Error).message }
  }
  const result = gameProgressSchema.safeParse(json)
  if (result.success) return { progress: result.data }
  const issue = result.error.issues[0]
  const path = issue.path.join('.')
  return { error: path ? `${path}: ${issue.message}` : issue.message }
}
