"use client";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MovieGrid({ media_type }) {
  const [movies, setMovies] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [watchedIds, setWatchedIds] = useState(new Set());
  useEffect(() => {
    try {
      async function fetchData() {
        const [popularRes, likesRes, watchedRes] = await Promise.all([
          fetch(`${baseUrl}/popular/${media_type}`),
          fetch(`${baseUrl}/likes`, { credentials: "include" }),
          fetch(`${baseUrl}/watched`, { credentials: "include" }),
        ]);

        const popularData = await popularRes.json();
        setMovies(popularData.results || []);
        localStorage.setItem(
          media_type,
          JSON.stringify(popularData.results || [])
        );

        if (likesRes.ok) {
          const likes = await likesRes.json();
          const ids = new Set(
            (likes.items || [])
              .filter((it) => it.media_type === media_type)
              .map((it) => it.movie_id)
          );
          setLikedIds(ids);
        } else {
          setLikedIds(new Set());
        }

        if (watchedRes.ok) {
          const watched = await watchedRes.json();
          const ids = new Set(
            (watched.items || [])
              .filter((it) => it.media_type === media_type)
              .map((it) => it.movie_id)
          );
          setWatchedIds(ids);
        } else {
          setWatchedIds(new Set());
        }
      }
      fetchData();
    } catch (error) {
      console.log("huuuu", error);
    }
  }, []);
  return (
    <div
      id={media_type === "movie" ? "movies-section" : "tv-section"}
      className="flex flex-col gap-2 px-5 py-5 w-full scroll-mt-24"
    >
      <h1 className="text-2xl font-bold">
        Trending {media_type === "movie" ? "Movies" : "TV Shows"}
      </h1>
      <ul
        className="grid gap-2 justify-start overflow-y-auto w-full h-full"
        style={{
          // display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          // gridAutoRows: "1fr",
        }}
      >
        {movies.map((movie, index) => (
          <li key={index}>
            <MovieCard
              movie={movie}
              media_type={media_type}
              initialLiked={likedIds.has(movie.id)}
              initialWatched={watchedIds.has(movie.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
