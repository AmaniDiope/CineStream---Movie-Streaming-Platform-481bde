import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieSlider from "../components/MovieSlider";
import useMovies from "../hooks/useMovies";

const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const { movies, isLoading } = useMovies();
  
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      // Set hero movie (random from top rated)
      const topRated = [...movies]
        .filter(movie => movie.rating >= 4)
        .sort(() => Math.random() - 0.5);
      setHeroMovie(topRated[0]);

      // Featured movies (top 10 by rating)
      setFeaturedMovies(
        [...movies]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 10)
      );

      // New releases (last 10 added)
      setNewReleases(
        [...movies]
          .sort((a, b) => b.dateAdded?.toDate?.() - a.dateAdded?.toDate?.())
          .slice(0, 10)
      );

      // Genre-specific collections
      setActionMovies(movies.filter(movie => 
        movie.genres?.includes("Action")
      ));
      setDramaMovies(movies.filter(movie => 
        movie.genres?.includes("Drama")
      ));
      setComedyMovies(movies.filter(movie => 
        movie.genres?.includes("Comedy")
      ));
    }
  }, [movies, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[80vh] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${heroMovie.backdropUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyQmJhY2tkcm9wfGVufDB8fHx8MTc0NzQ4MjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"}")`,
              filter: "brightness(0.5)"
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {heroMovie.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                <span>{heroMovie.year}</span>
                {heroMovie.runtime && (
                  <span>{heroMovie.runtime} min</span>
                )}
                {heroMovie.rating && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polygon points="128 158.54 157.67 176 149.6 143.41 176 121.61 141.35 118.94 128 88 114.65 118.94 80 121.61 106.4 143.41 98.33 176 128 158.54" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    <span className="ml-1">{heroMovie.rating}</span>
                  </span>
                )}
              </div>

              <p className="text-gray-300 mb-6 line-clamp-3">
                {heroMovie.description}
              </p>

              <div className="flex space-x-4">
                <Link
                  to={`/watch/${heroMovie.id}`}
                  className="inline-flex items-center px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M170.83,118.13l-52-36A12,12,0,0,0,100,92v72a12,12,0,0,0,18.83,9.87l52-36a12,12,0,0,0,0-19.74Z"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Watch Now</span>
                </Link>
                <Link
                  to={`/movie/${heroMovie.id}`}
                  className="inline-flex items-center px-6 py-3 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="124" cy="84" r="16"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M120,124a8,8,0,0,1,8,8v36a8,8,0,0,0,8,8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">More Info</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Featured Movies */}
        <MovieSlider
          title="Featured Movies"
          movies={featuredMovies}
          isLoading={isLoading}
        />

        {/* New Releases */}
        <MovieSlider
          title="New Releases"
          movies={newReleases}
          isLoading={isLoading}
        />

        {/* Action Movies */}
        {actionMovies.length > 0 && (
          <MovieSlider
            title="Action Movies"
            movies={actionMovies}
            isLoading={isLoading}
          />
        )}

        {/* Drama Movies */}
        {dramaMovies.length > 0 && (
          <MovieSlider
            title="Drama Movies"
            movies={dramaMovies}
            isLoading={isLoading}
          />
        )}

        {/* Comedy Movies */}
        {comedyMovies.length > 0 && (
          <MovieSlider
            title="Comedy Movies"
            movies={comedyMovies}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with New Releases
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on new movies added to our collection.
            </p>
            <form className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors flex items-center"
              >
                Subscribe
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="160 112 160 160 112 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;