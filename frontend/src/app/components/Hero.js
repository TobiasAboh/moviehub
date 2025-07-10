"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MovieHero = ({ movie, index }) => {
  return (
    <div
      key={index}
      className="flex-shrink-0 w-full h-screen relative snap-start"
    >
      {movie.backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          unoptimized
        />
      )}
      <div className="absolute bottom-0 left-0 w-full p-8 pb-20 bg-gradient-to-t from-black to-transparent text-white">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="text-lg max-w-2xl mt-2 line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default function Hero() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("movies");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMovies(parsed);
        }
      } catch (error) {
        console.error("Failed to parse movies from localStorage:", error);
      }
    }
  }, []);

  if (movies.length === 0) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center text-white bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto snap-x scrollbar-hide snap-mandatory scroll-smooth">
      {movies.map((movie, index) => {
        return <MovieHero movie={movie} index={index} key={index} />
      })}
    </div>
  );
}
