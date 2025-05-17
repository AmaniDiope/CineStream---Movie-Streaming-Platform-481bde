import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import useMovie from "../hooks/useMovie";
import useMovies from "../hooks/useMovies";
import { formatDate } from "../utils/formatters";

const WatchMovie = () => {
  const { id } = useParams();
  const { movie, isLoading, error, incrementViews } = useMovie(id);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  // Get related movies based on genres
  const { movies: allMovies, isLoading: isLoadingRelated } = useMovies();
  const [relatedMovies, setRelatedMovies] = useState([]);

  // Increment view count when the page loads
  useEffect(() => {
    if (movie && !isLoading) {
      incrementViews();
    }
  }, [movie, incrementViews, isLoading]);

  // Find related movies by genre
  useEffect(() => {
    if (movie && allMovies.length) {
      const related = allMovies
        .filter(m => 
          m.id !== movie.id && 
          m.genres && 
          movie.genres && 
          m.genres.some(genre => movie.genres.includes(genre))
        )
        .slice(0, 6);
      
      setRelatedMovies(related);
    }
  }, [movie, allMovies]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4 flex flex-col justify-center items-center">
        <h1 className="text-2xl text-red-500">Error Loading Movie</h1>
        <p className="text-white mt-2">{error}</p>
        <Link to="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4 flex flex-col justify-center items-center">
        <h1 className="text-2xl text-white">Movie Not Found</h1>
        <Link to="/" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Player */}
        <div className="mt-4 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <VideoPlayer 
            videoUrl={movie.videoUrl} 
            title={movie.title}
            downloadUrl={movie.videoUrl}
            poster={movie.posterUrl}
          />
        </div>
        
        {/* Movie Information */}
        <div className="mt-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
            
            <div className="mt-2 md:mt-0 flex items-center space-x-4">
              <a 
                href={movie.videoUrl} 
                download
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Download</span>
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-400 space-x-4">
            <span>{movie.year}</span>
            <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
            <span>{movie.rating ? `Rating: ${movie.rating}` : ""}</span>
            <span>Added: {formatDate(movie.dateAdded?.toDate?.() || new Date())}</span>
            <span>{movie.views || 0} views</span>
          </div>
          
          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.map((genre) => (
                <span 
                  key={genre} 
                  className="px-3 py-1 bg-gray-700 text-xs text-gray-300 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {/* Description */}
          <div className="mt-4">
            <p className={`text-gray-300 ${!isInfoExpanded && "line-clamp-3"}`}>
              {movie.description}
            </p>
            {movie.description && movie.description.length > 200 && (
              <button 
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="text-blue-400 hover:text-blue-300 mt-1 text-sm"
              >
                {isInfoExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
          
          {/* Cast & Crew */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((person, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-700 text-sm text-gray-300 rounded-full"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Director */}
          {movie.director && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Director</h3>
              <p className="text-gray-300">{movie.director}</p>
            </div>
          )}
        </div>
        
        {/* Related Movies */}
        <div className="mt-12">
          <h2 className="text-xl font-medium text-white mb-4">You May Also Like</h2>
          
          {isLoadingRelated ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : relatedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <Link 
                  to={`/movie/${relatedMovie.id}`} 
                  key={relatedMovie.id}
                  className="block group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                    <img 
                      src={relatedMovie.posterUrl || "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxkZWZhdWx0JTJCbW92aWUlMkJwb3N0ZXJ8ZW58MHx8fHwxNzQ3NDgyMjU2fDA&ixlib=rb-4.1.0&q=80&w=1080"} 
                      alt={relatedMovie.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm">{relatedMovie.title}</h3>
                        <p className="text-gray-300 text-xs">{relatedMovie.year}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No related movies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;