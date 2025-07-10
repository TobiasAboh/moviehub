import MovieGrid from "../components/MovieGrid";
import Hero from "../components/Hero";

export default function HomePage() {
    return (
        <div className="flex flex-col pt-18 overflow-y-auto">
            <Hero />
            <MovieGrid />
        </div>
    );
}