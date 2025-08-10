"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const MovieHero = ({ movie, index }) => {
  return (
    <div
      key={index}
      className="flex-shrink-0 w-full h-[100%] relative snap-start"
    >
      {movie.backdrop_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt="poster"
          fill
          className="object-cover"
          unoptimized
        />
      )}
      <div className="absolute bottom-0 left-0 w-full p-8 pb-30 bg-gradient-to-t from-[#b72c2c] to-transparent text-white">
        <h1 className="text-4xl font-bold">{movie.title ? movie.title : movie.name}</h1>
        <p className="text-lg max-w-2xl mt-2 line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default function Hero() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);

  // Fetch movies from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("movie");
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

  const extendedMovies =
    movies.length > 0 ? [movies[movies.length - 1], ...movies, movies[0]] : [];

  // Initial scroll to first real slide
  useEffect(() => {
    if (scrollRef.current && extendedMovies.length > 0) {
      scrollRef.current.scrollLeft = window.innerWidth;
    }
  }, [extendedMovies.length]); // Depend on length to run once

  const handleScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const container = scrollRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const rawIndex = Math.round(container.scrollLeft / width);

    if (rawIndex === 0) {
      // After a short delay, snap to the correct position
      timeoutRef.current = setTimeout(() => {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = movies.length * width;
        setCurrentIndex(movies.length);
        container.style.scrollBehavior = "smooth";
      }, 50);
    } else if (rawIndex === movies.length + 1) {
      timeoutRef.current = setTimeout(() => {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = width;
        setCurrentIndex(1);
        container.style.scrollBehavior = "smooth";
      }, 50);
    } else {
      setCurrentIndex(rawIndex);
    }
  };

  // Auto scroll every few seconds
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;

      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        scrollRef.current?.scrollTo({
          left: nextIndex * window.innerWidth,
          behavior: "smooth",
        });
        return nextIndex > movies.length ? 1 : nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (extendedMovies.length === 0) {
    return (
      <div className="relative h-screen flex items-center justify-center text-white bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex h-screen overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
    >
      {extendedMovies.map((movie, index) => (
        <MovieHero movie={movie} index={index} key={index} />
      ))}
    </div>
  );
}
