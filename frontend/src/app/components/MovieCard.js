import Image from "next/image";
import { useState, useEffect } from "react";
import { FaHeart, FaCheck } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { motion } from "framer-motion";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MovieCard({
  movie,
  media_type,
  initialLiked = false,
  initialWatched = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [watched, setWatched] = useState(initialWatched);
  const [openOptions, setOpenOptions] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Sync when parent updates
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);
  useEffect(() => {
    setWatched(initialWatched);
  }, [initialWatched]);

  // Handle click outside to close options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openOptions) {
        setOpenOptions(false);
      }
    };

    if (openOptions) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openOptions]);

  const handleOpenOptions = (e) => {
    e.preventDefault();
    setOpenOptions(!openOptions);
  };

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(
        `${baseUrl}/watchlist/${media_type}/${movie.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowNotification(true);
        setOpenOptions(false);

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      } else {
        console.error("Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

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
    media_type === "movie"
      ? movie.title || "Unknown Movie"
      : movie.name || "Unknown TV Show"
  );
  return (
    <a
      href={`/content/${media_type}/${movie.id}`}
      className="flex flex-col items-center justify-center bg-black hover:bg-gray-800 h-[400px] overflow-hidden text-ellipsis rounded-xl"
    >
      <div className="relative w-full h-[100%]">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder-poster.jpg"
          }
          alt="poster"
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="w-full p-4 relative">
        <button
          onClick={handleOpenOptions}
          className="absolute top-2 right-2 z-40 text-white hover:text-gray-300"
        >
          <CiMenuKebab size={20} className="relative" />
        </button>
        {openOptions && (
          <button
            onClick={handleAddToWatchlist}
            className="absolute top-1 right-6 z-40 bg-white p-2 text-black rounded-lg hover:bg-gray-200"
          >
            Add to watchlist
          </button>
        )}
        {showNotification && (
          <div className="absolute top-1 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Added to watchlist!
          </div>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
        <p className={`${title.length > 22 ? "line-clamp-2" : "line-clamp-3"}`}>
          {movie.overview || "No overview available"}
        </p>
      </div>
      <div className="flex w-full justify-end items-center text-sm gap-2 relative fixed right-0 pr-2 mb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleWatch();
          }}
          className="flex justify-center items-center gap-1 px-1 py-1 rounded-lg border border-white hover:bg-white/50 hover:text-black"
        >
          {!watched ? "Add to Watched" : "Watched"}
          <FaCheck className={`${watched ? "text-green-500" : ""}`} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          className="border border-white rounded-lg px-2 py-1 hover:bg-white/50 hover:text-black"
        >
          <FaHeart className={`text-lg ${liked ? "text-red-500" : ""}`} />
        </button>
      </div>
    </a>
  );
}
