"use client";
import { useState, useEffect } from "react";
import MovieCard from "@/app/components/MovieCard";
import { useAuth } from "@/app/context/AuthContext";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function WatchedPage() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loggedIn } = useAuth();

  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch liked movies from backend
        const response = await fetch(`${baseUrl}/watched`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch liked movies");
        }

        const data = await response.json();
        const watchedItems = data.items || [];

        // Fetch full movie details from backend for each liked item
        const moviePromises = watchedItems.map(async (item) => {
          const movieResponse = await fetch(
            `${baseUrl}/content/${item.movie_id}?type=${item.media_type}`,
            {
              credentials: "include",
            }
          );

          if (!movieResponse.ok) {
            console.error(`Failed to fetch movie ${item.movie_id}`);
            return null;
          }

          const movieData = await movieResponse.json();
          return {
            ...movieData,
            media_type: item.media_type,
          };
        });

        const movies = await Promise.all(moviePromises);
        const validMovies = movies.filter((movie) => movie !== null);

        setWatchedMovies(validMovies);
      } catch (err) {
        console.error("Error fetching liked movies:", err);
        setError("Failed to load liked movies");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedMovies();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your watched movies
          </h1>
          <p className="text-gray-400">
            You need to be logged in to see your watched movies.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your watched movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Watched Movies</h1>

        {watchedMovies.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No watched movies yet</h2>
            <p className="text-gray-400">
              Start exploring movies and TV shows to build your collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchedMovies.map((movie, index) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}-${index}`}
                movie={movie}
                media_type={movie.media_type}
                initialLiked={true}
                initialWatched={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
