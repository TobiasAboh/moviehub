import Image from "next/image";
import Hero from "./components/Hero";
import MovieGrid from "./components/MovieGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
        <Hero />
        <MovieGrid media_type="movie" />
        <MovieGrid media_type="tv" />
      </div>
    </div>
  );
}
