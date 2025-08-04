"use client";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MovieGrid() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    try {
      async function fetchData() {
        const response = await fetch(`${baseUrl}/movies`);
        const data = await response.json();
        console.log(data.results);
        setMovies(data.results);
        localStorage.setItem("movies", JSON.stringify(data.results));
      }
      fetchData();
    } catch (error) {
      console.log("huuuu", error);
    }
  }, []);
  return (
    <div className="flex flex-col gap-2 px-5 py-5 w-full">
      <h1 className="text-2xl font-bold">Trending Movies</h1>
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
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
}
