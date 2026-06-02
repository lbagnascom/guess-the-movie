import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/game"

interface ResultScreenProps {
  movie: Movie
  won: boolean
  reviewNumber: number
  onPlayAgain: () => void
}

export function ResultScreen({
  movie,
  won,
  reviewNumber,
  onPlayAgain,
}: ResultScreenProps) {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
      {won ? (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-5xl">🎉</span>
            <h2 className="text-2xl font-bold">You got it!</h2>
            <p className="text-muted-foreground text-sm">
              Guessed on review {reviewNumber}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-5xl">😔</span>
            <h2 className="text-2xl font-bold">Better luck next time</h2>
            <p className="text-muted-foreground text-sm">The movie was…</p>
          </div>
        </>
      )}

      {movie.poster && (
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-64 rounded-lg object-cover shadow-md"
        />
      )}

      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">{movie.title}</p>
        <p className="text-muted-foreground text-sm">{movie.year}</p>
      </div>

      <Button size="lg" onClick={onPlayAgain}>
        Play again
      </Button>
    </div>
  )
}
