import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect for header transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      // Mock search results - in real app, this would fetch from Firebase
      const mockResults = [
        { id: "1", title: "The Avengers", year: 2012, posterUrl: "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxhdmVuZ2VycyUyQm1vdmllJTJCcG9zdGVyJTJCdGh1bWJuYWlsfGVufDB8fHx8MTc0NzQ4MjA3Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
        { id: "2", title: "Avatar", year: 2009, posterUrl: "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxhdmF0YXIlMkJtb3ZpZSUyQnBvc3RlciUyQnRodW1ibmFpbHxlbnwwfHx8fDE3NDc0ODIwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
        { id: "3", title: "Inception", year: 2010, posterUrl: "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxpbmNlcHRpb24lMkJtb3ZpZSUyQnBvc3RlciUyQnRodW1ibmFpbHxlbnwwfHx8fDE3NDc0ODIwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080" }
      ].filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    }, 300)
  ).current;

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle movie selection from search results
  const handleSelectMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900 shadow-lg" : "bg-gradient-to-b from-gray-900 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="232" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="84" r="20"/><circle cx="128" cy="172" r="20"/><circle cx="172" cy="128" r="20"/><circle cx="84" cy="128" r="20"/></svg>
              <span className="ml-2 text-xl font-bold text-white">CineStream</span>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            <Link to="/new-releases" className="text-gray-300 hover:text-white transition-colors">
              New Releases
            </Link>
            <Link to="/trending" className="text-gray-300 hover:text-white transition-colors">
              Trending
            </Link>
          </nav>

          {/* Search and Admin - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="bg-transparent border-none focus:outline-none text-white w-48"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <button className="ml-2 text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="112 96 160 96 160 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </button>
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
                  <ul>
                    {searchResults.map((movie) => (
                      <li 
                        key={movie.id} 
                        className="border-b border-gray-700 last:border-none"
                      >
                        <button 
                          className="flex items-center w-full p-3 hover:bg-gray-700 text-left"
                          onClick={() => handleSelectMovie(movie.id)}
                        >
                          <div className="w-10 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                            <img 
                              src={movie.posterUrl} 
                              alt={movie.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-white text-sm font-medium">{movie.title}</p>
                            <p className="text-gray-400 text-xs">{movie.year}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Admin Link */}
            <Link 
              to="/admin/login" 
              className="text-gray-300 hover:text-white transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="40" y="88" width="176" height="128" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,88V56a40,40,0,0,1,80,0V88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="144" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="164" x2="128" y2="180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-1">Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="160" x2="96" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="160 112 160 160 112 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </button>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="88" y="88" width="80" height="80" rx="12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M40,156H76.69a8,8,0,0,1,5.65,2.34l19.32,19.32a8,8,0,0,0,5.65,2.34h41.38a8,8,0,0,0,5.65-2.34l19.32-19.32a8,8,0,0,1,5.65-2.34H216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="76" x2="128" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="96 108 128 140 160 108" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              className="bg-gray-800 text-white w-full rounded-full px-4 py-2 focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg overflow-hidden">
                <ul>
                  {searchResults.map((movie) => (
                    <li 
                      key={movie.id} 
                      className="border-b border-gray-700 last:border-none"
                    >
                      <button 
                        className="flex items-center w-full p-3 hover:bg-gray-700 text-left"
                        onClick={() => handleSelectMovie(movie.id)}
                      >
                        <div className="w-10 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                          <img 
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-white text-sm font-medium">{movie.title}</p>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <nav className="px-4 pt-2 pb-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="block py-2 text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/new-releases" 
              className="block py-2 text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              New Releases
            </Link>
            <Link 
              to="/trending" 
              className="block py-2 text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              to="/admin/login" 
              className="block py-2 text-gray-300 hover:text-white flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="40" y="88" width="176" height="128" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,88V56a40,40,0,0,1,80,0V88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="144" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="164" x2="128" y2="180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              <span className="ml-1">Admin</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;