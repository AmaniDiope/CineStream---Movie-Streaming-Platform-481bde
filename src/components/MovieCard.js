import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MovieCard = ({ movie, className = "" }) => {
  const {
    id,
    title,
    year,
    rating,
    duration,
    posterUrl,
    genres = [],
    quality
  } = movie;

  return (
    <Link 
      to={`/movie/${id}`}
      className={`group relative block bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative">
        <img
          src={posterUrl || "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxkZWZhdWx0JTJCbW92aWUlMkJwb3N0ZXJ8ZW58MHx8fHwxNzQ3NDgyMjU2fDA&ixlib=rb-4.1.0&q=80&w=1080"}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Quality Badge */}
            {quality && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded mb-2">
                {quality}
              </span>
            )}
            
            {/* Title */}
            <h3 className="text-white font-medium line-clamp-2">
              {title}
            </h3>
            
            {/* Year & Duration */}
            <div className="flex items-center text-sm text-gray-300 mt-1">
              {year && <span>{year}</span>}
              {duration && (
                <>
                  <span className="mx-2">•</span>
                  <span>{duration} min</span>
                </>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polygon points="128 158.54 157.67 176 149.6 143.41 176 121.61 141.35 118.94 128 88 114.65 118.94 80 121.61 106.4 143.41 98.33 176 128 158.54" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-1 text-sm text-yellow-400">{rating}</span>
              </div>
            )}
            
            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {genres.slice(0, 2).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {genres.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">
                    +{genres.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-600 bg-opacity-80 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M170.83,118.13l-52-36A12,12,0,0,0,100,92v72a12,12,0,0,0,18.83,9.87l52-36a12,12,0,0,0,0-19.74Z"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
        </div>
      </div>

      {/* Mobile/Default View Info (visible when not hovering) */}
      <div className="p-3 group-hover:hidden">
        <h3 className="text-white font-medium line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center text-sm text-gray-400 mt-1">
          {year && <span>{year}</span>}
          {rating && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="24" x2="176" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="80" y1="24" x2="80" y2="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polygon points="128 158.54 157.67 176 149.6 143.41 176 121.61 141.35 118.94 128 88 114.65 118.94 80 121.61 106.4 143.41 98.33 176 128 158.54" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-1">{rating}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number,
    rating: PropTypes.number,
    duration: PropTypes.number,
    posterUrl: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    quality: PropTypes.string
  }).isRequired,
  className: PropTypes.string
};

export default MovieCard;