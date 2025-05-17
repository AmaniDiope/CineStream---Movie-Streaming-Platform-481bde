import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard";

const MovieSlider = ({ 
  title, 
  movies = [], 
  isLoading = false,
  loadMore = null,
  className = "" 
}) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if we can scroll in either direction
  const checkScrollability = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScrollability);
      // Initial check
      checkScrollability();
      return () => slider.removeEventListener("scroll", checkScrollability);
    }
  }, [movies]);

  // Recheck scrollability when window resizes
  useEffect(() => {
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle scroll buttons
  const scroll = (direction) => {
    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Handle scroll to end detection for infinite loading
  const handleScroll = () => {
    if (!loadMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const scrollEnd = scrollWidth - clientWidth;
    
    // If we're near the end (within 20px), load more
    if (scrollLeft >= scrollEnd - 20) {
      loadMore();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Title */}
      {title && (
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      )}

      {/* Slider Container */}
      <div className="relative group">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transform -translate-x-1/2 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transform translate-x-1/2 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex-shrink-0 w-[180px] md:w-[200px] animate-pulse"
              >
                <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))
          ) : movies.length > 0 ? (
            // Movie cards
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-[180px] md:w-[200px]"
              >
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            // Empty state
            <div className="flex items-center justify-center w-full py-8">
              <p className="text-gray-400">No movies available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MovieSlider.propTypes = {
  title: PropTypes.string,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      posterUrl: PropTypes.string,
      year: PropTypes.number,
      rating: PropTypes.number
    })
  ),
  isLoading: PropTypes.bool,
  loadMore: PropTypes.func,
  className: PropTypes.string
};

export default MovieSlider;