import { useQuery } from "@tanstack/react-query"
import { useGame } from "@/hooks/useGame"
import { StartScreen } from "@/components/StartScreen"
import { GameScreen } from "@/components/GameScreen"
import { ResultScreen } from "@/components/ResultScreen"
import { MoviesSchema, type TryResult } from "@/types/game"

function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () =>
      import("@/data/movies.json").then((m) => MoviesSchema.parse(m.default)),
    staleTime: Infinity,
  })
}

export default function App() {
  const { data: movies = [], isLoading } = useMovies()
  const {
    phase,
    movie,
    currentReview,
    reviewNumber,
    totalReviews,
    tryResults,
    startGame,
    submitGuess,
    skip,
    reset,
  } = useGame()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : phase === "start" ? (
        <StartScreen onPlay={() => startGame(movies)} />
      ) : phase === "playing" && currentReview ? (
        <GameScreen
          review={currentReview}
          reviewNumber={reviewNumber}
          totalReviews={totalReviews}
          tryResults={tryResults as TryResult[]}
          onSubmit={submitGuess}
          onSkip={skip}
        />
      ) : (phase === "won" || phase === "lost") && movie ? (
        <ResultScreen
          movie={movie}
          won={phase === "won"}
          reviewNumber={reviewNumber}
          onPlayAgain={reset}
        />
      ) : null}
    </div>
  )
}
