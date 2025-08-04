import Image from "next/image";
import { motion } from "framer-motion";

export default function MovieCard({ movie }) {
  return (
    <a href={`/movie/${movie.id}`} className="flex flex-col items-center justify-center bg-gray-600 h-[400px] overflow-hidden text-ellipsis rounded-xl">
      <div className="relative w-full h-[100%]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="p-4">
        <h1 className="text-lg font-bold">{movie.title}</h1>
        <p className={`${movie.title.length > 22 ? "line-clamp-2" : "line-clamp-3"}`}>{movie.overview}</p>
      </div>
    </a>
  );
}
