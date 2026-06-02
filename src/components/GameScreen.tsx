import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TryResult } from "@/types/game"

interface GameScreenProps {
  review: string
  reviewNumber: number
  totalReviews: number
  tryResults: TryResult[]
  onSubmit: (guess: string) => void
  onSkip: () => void
}

function barColor(i: number, tryResults: TryResult[]): string {
  const result = tryResults[i]
  if (result === "failed") return "bg-red-500"
  if (result === "skipped") return "bg-muted-foreground/40"
  if (i === tryResults.length) return "bg-foreground"
  return "bg-muted"
}

export function GameScreen({
  review,
  reviewNumber,
  totalReviews,
  tryResults,
  onSubmit,
  onSkip,
}: GameScreenProps) {
  const [guess, setGuess] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!guess.trim()) return
    onSubmit(guess.trim())
    setGuess("")
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Review {reviewNumber} of {totalReviews}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalReviews }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${barColor(i, tryResults)}`}
            />
          ))}
        </div>
      </div>

      {/* Review */}
      <blockquote className="border-l-2 pl-4 italic">
        <p className="text-lg leading-relaxed">{review}</p>
      </blockquote>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          autoFocus
          placeholder="Type a movie title…"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button type="submit" className="flex-1" disabled={!guess.trim()}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}
