import MovieGrid from "../components/MovieGrid";
import Hero from "../components/Hero";

export default function HomePage() {
    return (
        <div className="flex flex-col pt-15 overflow-y-auto scrollbar-hide">
            <Hero />
            <MovieGrid />
        </div>
    );
}