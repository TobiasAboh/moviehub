import Image from "next/image";
import { useState, useEffect } from "react";
import { FaHeart, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MovieCard({
  movie,
  media_type,
  initialLiked = false,
  initialWatched = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [watched, setWatched] = useState(initialWatched);

  // Sync when parent updates
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);
  useEffect(() => {
    setWatched(initialWatched);
  }, [initialWatched]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/like/${media_type}/${movie.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: media_type,
            movie_id: movie.id,
            liked: !liked,
          }),
        }
      );
      if (response.ok) {
        setLiked(!liked);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleWatch = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/watch/${media_type}/${movie.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: media_type,
            movie_id: movie.id,
            watched: !watched,
          }),
        }
      );
      if (response.ok) {
        setWatched(!watched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [title, setTitle] = useState(
    media_type === "movie" ? movie.title : movie.name
  );
  return (
    <a
      href={`/content/${media_type}/${movie.id}`}
      className="flex flex-col items-center justify-center bg-black hover:bg-gray-800 h-[400px] overflow-hidden text-ellipsis rounded-xl"
    >
      <div className="relative w-full h-[100%]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt="poster"
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="p-4">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className={`${title.length > 22 ? "line-clamp-2" : "line-clamp-3"}`}>
          {movie.overview}
        </p>
      </div>
      <div className="flex items-center gap-2 relative fixed right-0 mb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleWatch();
          }}
          className="flex gap-2 p-2 rounded-lg border border-white hover:bg-white/50 hover:text-black"
        >
          {!watched ? "Add to Watched" : "Watched"}{" "}
          <FaCheck className={`text-xl ${watched ? "text-green-500" : ""}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          className="border border-white rounded-lg p-2 hover:bg-white/50 hover:text-black"
        >
          <FaHeart className={`text-xl ${liked ? "text-red-500" : ""}`} />
        </button>
      </div>
    </a>
  );
}
