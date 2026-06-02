#!/usr/bin/env python3
"""
One-time script to scrape popular Letterboxd films and their popular reviews,
and dump the result to src/data/movies.json.

Usage:
    pip install letterboxdpy
    python scripts/scrape.py
"""

import json
import time
from pathlib import Path

from letterboxdpy.films import Films
from letterboxdpy.movie import Movie

OUTPUT_PATH = Path(__file__).parent.parent / "src" / "data" / "movies.json"
POPULAR_URL = "https://letterboxd.com/films/popular/"
MAX_FILMS = 100
MIN_REVIEWS = 3
SLEEP_BETWEEN_REQUESTS = 1.0  # seconds, be polite to Letterboxd


def scrape() -> None:
    print(f"Fetching up to {MAX_FILMS} popular films from Letterboxd...")
    films = Films(POPULAR_URL, max=MAX_FILMS)

    dataset = []
    total = len(films.movies)

    for i, (film_id, film) in enumerate(films.movies.items(), start=1):
        slug = film["slug"]
        print(f"[{i}/{total}] Scraping '{film.get('name', slug)}'...")

        try:
            movie = Movie(slug)
        except Exception as e:
            print(f"  ⚠ Skipping '{slug}': {e}")
            continue

        # TODO: r["rating"] is always None due to a bug in letterboxdpy's
        # extract_rating() — the rated-X CSS class selector is broken against
        # the current Letterboxd markup. Omitted until fixed upstream or patched.
        reviews = [
            {
                "username": r["user"]["username"],
                "display_name": r["user"]["display_name"],
                "text": r["review"].strip(),
            }
            for r in (movie.popular_reviews or [])
            if r.get("review") and r["review"].strip()
        ]

        if len(reviews) < MIN_REVIEWS:
            print(f"  ⚠ Skipping '{slug}': only {len(reviews)} review(s)")
            continue

        dataset.append(
            {
                "id": film_id,
                "slug": slug,
                "title": movie.title,
                "year": movie.year,
                "poster": movie.poster,
                "reviews": reviews,
            }
        )

        print(f"  ✓ {movie.title} ({movie.year}) — {len(reviews)} review(s)")
        time.sleep(SLEEP_BETWEEN_REQUESTS)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f"\nDone! {len(dataset)} films written to {OUTPUT_PATH}")


if __name__ == "__main__":
    scrape()
