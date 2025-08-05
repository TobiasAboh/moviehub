"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MoviePage({ params }) {
  const { media_type, id } = React.use(params);
  const [movie, setMovie] = useState({});
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(
          `${baseUrl}/content/${id}/videos?type=${media_type}`
        );
        if (response.ok) {
          const data = await response.json();
          setTrailer(data.results[0]);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchMovie() {
      try {
        const response = await fetch(
          `http://localhost:8080/content/${id}?type=${media_type}`
        );
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
          console.log(data, media_type);

          fetchVideo();
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchMovie();
  }, []);

  return (
    <div className="flex flex-col items-center w-full mt-5">
      <div className="flex gap-5 w-[80%]">
        {trailer ? (
          <iframe
            width="560"
            height="415"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
            allowFullScreen
            className="w-full"
          />
        ) : (
          <div className="relative w-full h-80">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="poster"
              layout="fill"
              objectFit="contain"
              className="rounded-t-xl"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">{movie.title ? movie.title : movie.name}</h1>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
