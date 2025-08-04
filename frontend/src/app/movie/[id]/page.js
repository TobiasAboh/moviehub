"use client";
import React from "react";
import { useEffect, useState } from "react";

export default function MoviePage({ params }) {
  const movieId = React.use(params).id;
  const [movie, setMovie] = useState({});
  const [trailer, setTrailer] = useState({});

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(
          `http://localhost:8080/movies/${movieId}/videos`
        );
        if (response.ok) {
          const data = await response.json();
          setTrailer(data.results[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchMovie() {
      try {
        const response = await fetch(`http://localhost:8080/movies/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchMovie();
    fetchVideo();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-5 w-[80%]">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
          allowFullScreen
        />
        <div className="flex flex-col gap-2">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
