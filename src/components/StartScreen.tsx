import { Button } from "@/components/ui/button"

interface StartScreenProps {
  onPlay: () => void
}

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl">🎬</span>
        <h1 className="text-4xl font-bold tracking-tight">Guess the Movie</h1>
        <p className="text-muted-foreground max-w-sm text-base">
          We'll show you real reviews from Letterboxd. Read them and guess the film.
        </p>
      </div>
      <Button size="lg" onClick={onPlay}>
        Play
      </Button>
    </div>
  )
}
