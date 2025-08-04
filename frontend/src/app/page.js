import Image from "next/image";
import Hero from "./components/Hero";
import MovieGrid from "./components/MovieGrid";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="flex flex-col overflow-y-auto scrollbar-hide">
            <Hero />
            <MovieGrid />
        </div>
    </div>
    
  );
}
