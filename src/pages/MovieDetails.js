import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useMovie from "../hooks/useMovie";
import VideoPlayer from "../components/VideoPlayer";
import { formatDate } from "../utils/formatters";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, isLoading, error } = useMovie(id);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-red-500 mb-4">Error Loading Movie</h1>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-white mb-4">Movie Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgb(15, 23, 42)), url("${movie.backdropUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyQmJhY2tkcm9wfGVufDB8fHx8MTc0NzQ4MjI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"}")`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900"></div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-lg transform md:translate-y-16">
              <img
                src={movie.posterUrl || "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyQnBvc3RlcnxlbnwwfHx8fDE3NDc0ODIyODV8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            {/* Title and Quick Info */}
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <span>{movie.year}</span>
                {movie.runtime && <span>{movie.runtime} min</span>}
                {movie.rating && <span>{movie.rating}</span>}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(genre => (
                      <span 
                        key={genre}
                        className="px-2 py-1 bg-gray-800 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/watch/${movie.id}`}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M170.83,118.13l-52-36A12,12,0,0,0,100,92v72a12,12,0,0,0,18.83,9.87l52-36a12,12,0,0,0,0-19.74Z"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Watch Now</span>
                </Link>
                <a
                  href={movie.videoUrl}
                  download
                  className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="168 104 128 144 88 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  <span className="ml-2">Download</span>
                </a>
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M170.83,118.13l-52-36A12,12,0,0,0,100,92v72a12,12,0,0,0,18.83,9.87l52-36a12,12,0,0,0,0-19.74Z"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    <span className="ml-2">Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <div className="relative">
                <p className={`text-gray-300 ${!isDescriptionExpanded && "line-clamp-4"}`}>
                  {movie.description}
                </p>
                {movie.description && movie.description.length > 300 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue-400 hover:text-blue-300 mt-2"
                  >
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700 mb-2">
                        {actor.photoUrl ? (
                          <img
                            src={actor.photoUrl}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M63.8,199.37a72,72,0,0,1,128.4,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white font-medium">{actor.name}</p>
                      {actor.character && (
                        <p className="text-gray-400 text-sm">{actor.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Movie Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Movie Info</h3>
              <dl className="space-y-3">
                {movie.director && (
                  <div>
                    <dt className="text-gray-400">Director</dt>
                    <dd className="text-white">{movie.director}</dd>
                  </div>
                )}
                {movie.releaseDate && (
                  <div>
                    <dt className="text-gray-400">Release Date</dt>
                    <dd className="text-white">{formatDate(movie.releaseDate)}</dd>
                  </div>
                )}
                {movie.language && (
                  <div>
                    <dt className="text-gray-400">Language</dt>
                    <dd className="text-white">{movie.language}</dd>
                  </div>
                )}
                {movie.quality && (
                  <div>
                    <dt className="text-gray-400">Quality</dt>
                    <dd className="text-white">{movie.quality}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-400">Added</dt>
                  <dd className="text-white">{formatDate(movie.dateAdded?.toDate())}</dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {movie.tags && movie.tags.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="88" y="88" width="80" height="80" rx="12"/></svg>
            </button>
            <div className="relative pt-[56.25%]">
              <VideoPlayer
                videoUrl={movie.trailerUrl}
                title={`${movie.title} - Trailer`}
                poster={movie.posterUrl}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;