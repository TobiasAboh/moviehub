"use client";
import { useState, useEffect } from "react";
import MovieCard from "@/app/components/MovieCard";
import { useAuth } from "@/app/context/AuthContext";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function WatchlistPage() {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loggedIn } = useAuth();

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch watchlist movies from backend
        const response = await fetch(`${baseUrl}/watchlist`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch watchlist movies");
        }

        const data = await response.json();
        const watchlistItems = data.items || [];

        // Fetch full movie details from backend for each watchlist item
        const moviePromises = watchlistItems.map(async (item) => {
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

        setWatchlistMovies(validMovies);
      } catch (err) {
        console.error("Error fetching watchlist movies:", err);
        setError("Failed to load watchlist movies");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your watchlist
          </h1>
          <p className="text-gray-400">
            You need to be logged in to see your watchlist.
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
          <p>Loading your watchlist...</p>
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
        <h1 className="text-3xl font-bold mb-8">Your Watchlist</h1>

        {watchlistMovies.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              No movies in your watchlist yet
            </h2>
            <p className="text-gray-400">
              Start exploring movies and TV shows to build your watchlist!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlistMovies.map((movie, index) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}-${index}`}
                movie={movie}
                media_type={movie.media_type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
