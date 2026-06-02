import { useState, useCallback } from "react"
import type { Movie, GamePhase, TryResult } from "@/types/game"

const MAX_REVIEWS = 5

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
}

function isCorrectGuess(guess: string, title: string): boolean {
  return normalize(guess) === normalize(title)
}

interface GameState {
  phase: GamePhase
  movie: Movie | null
  reviews: string[]
  currentReviewIndex: number
  tryResults: TryResult[]
}

const INITIAL_STATE: GameState = {
  phase: "start",
  movie: null,
  reviews: [],
  currentReviewIndex: 0,
  tryResults: [],
}

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE)

  const startGame = useCallback((movies: Movie[]) => {
    const movie = pickRandom(movies)
    const reviews = shuffled(movie.reviews)
      .slice(0, MAX_REVIEWS)
      .map((r) => r.text)
    setState({ ...INITIAL_STATE, phase: "playing", movie, reviews })
  }, [])

  const submitGuess = useCallback((guess: string) => {
    setState((prev) => {
      if (!prev.movie) return prev

      if (isCorrectGuess(guess, prev.movie.title)) {
        return { ...prev, phase: "won" }
      }

      const tryResults = [...prev.tryResults, "failed" as TryResult]
      const next = prev.currentReviewIndex + 1

      if (next >= prev.reviews.length) {
        return { ...prev, tryResults, phase: "lost" }
      }

      return { ...prev, tryResults, currentReviewIndex: next }
    })
  }, [])

  const skip = useCallback(() => {
    setState((prev) => {
      const tryResults = [...prev.tryResults, "skipped" as TryResult]
      const next = prev.currentReviewIndex + 1

      if (next >= prev.reviews.length) {
        return { ...prev, tryResults, phase: "lost" }
      }

      return { ...prev, tryResults, currentReviewIndex: next }
    })
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    phase: state.phase,
    movie: state.movie,
    currentReview: state.reviews[state.currentReviewIndex] ?? null,
    reviewNumber: state.currentReviewIndex + 1,
    totalReviews: state.reviews.length,
    tryResults: state.tryResults,
    startGame,
    submitGuess,
    skip,
    reset,
  }
}
