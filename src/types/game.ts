import { z } from "zod"

export const ReviewSchema = z.object({
  username: z.string(),
  display_name: z.string(),
  text: z.string(),
})

export const MovieSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  year: z.number(),
  poster: z.string().nullable(),
  reviews: z.array(ReviewSchema),
})

export const MoviesSchema = z.array(MovieSchema)

export type Review = z.infer<typeof ReviewSchema>
export type Movie = z.infer<typeof MovieSchema>

export type GamePhase = "start" | "playing" | "won" | "lost"

export type TryResult = "failed" | "skipped"
