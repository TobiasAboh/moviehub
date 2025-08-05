"use client"
import { useRouter } from 'next/navigation';

export default function SearchOptions({ movies, closeOptions }) {
  const router = useRouter();

  const handleClick = (movie) => {
    router.push(`/content/${movie.media_type}/${movie.id}`);
    if (closeOptions) {
      closeOptions();
    }
  };

  return (
    <div className="absolute top-12 left-0 w-full bg-gray-300 text-black rounded-b-lg">
      {movies.slice(0, 6).map((movie, index) => (
        <div
          key={index}
          onClick={() => handleClick(movie)}
          className="flex gap-2 w-full p-2 hover:bg-gray-200 cursor-pointer"
        >
          {movie.media_type === "movie" ? movie.title : movie.name}
        </div>
      ))}
    </div>
  );
}