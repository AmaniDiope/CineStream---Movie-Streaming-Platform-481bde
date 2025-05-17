import { useState, useEffect, useCallback } from "react";
import { collection, query, getDocs, where, orderBy, limit, startAfter, deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase/config";

const useMovies = (initialFilters = {}) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies based on current filters
  const fetchMovies = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Start building the query
      let moviesQuery = collection(db, "movies");
      let constraints = [];
      
      // Apply filters
      if (filters.genre) {
        constraints.push(where("genres", "array-contains", filters.genre));
      }
      
      if (filters.year) {
        constraints.push(where("year", "==", filters.year));
      }

      if (filters.language) {
        constraints.push(where("language", "==", filters.language));
      }

      // Apply sorting
      const sortField = filters.sortBy || "dateAdded";
      const sortDirection = filters.sortDirection || "desc";
      constraints.push(orderBy(sortField, sortDirection));

      // Pagination
      const pageSize = filters.pageSize || 12;
      constraints.push(limit(pageSize));

      if (lastVisible && !reset) {
        constraints.push(startAfter(lastVisible));
      }

      // Execute query
      const q = query(moviesQuery, ...constraints);
      const querySnapshot = await getDocs(q);
      
      // Process results
      const moviesList = [];
      querySnapshot.forEach((doc) => {
        moviesList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Update state based on whether it's a fresh load or pagination
      if (reset) {
        setMovies(moviesList);
      } else {
        setMovies(prev => [...prev, ...moviesList]);
      }

      // Update pagination state
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === pageSize);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching movies:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, lastVisible]);

  // Refresh movies when filters change
  useEffect(() => {
    setLastVisible(null);
    fetchMovies(true);
  }, [
    filters.genre,
    filters.year,
    filters.language,
    filters.sortBy,
    filters.sortDirection,
    filters.pageSize,
    fetchMovies
  ]);

  // Load more movies (pagination)
  const loadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchMovies();
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
    setLastVisible(null);
    fetchMovies(true);
  };

  // Delete a movie
  const deleteMovie = async (movieId) => {
    try {
      setError(null);
      
      // First, find the movie to get file paths
      const movieToDelete = movies.find(movie => movie.id === movieId);
      
      if (!movieToDelete) {
        throw new Error("Movie not found");
      }

      // Delete files from storage
      if (movieToDelete.videoPath) {
        const videoRef = ref(storage, movieToDelete.videoPath);
        await deleteObject(videoRef);
      }

      if (movieToDelete.posterPath) {
        const posterRef = ref(storage, movieToDelete.posterPath);
        await deleteObject(posterRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, "movies", movieId));
      
      // Update local state
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error deleting movie:", err);
      return false;
    }
  };

  // Get available filter options based on current movies
  const getFilterOptions = useCallback(() => {
    const genres = new Set();
    const years = new Set();
    const languages = new Set();

    movies.forEach(movie => {
      // Extract genres
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => genres.add(genre));
      }
      
      // Extract years
      if (movie.year) {
        years.add(movie.year);
      }
      
      // Extract languages
      if (movie.language) {
        languages.add(movie.language);
      }
    });

    return {
      genres: Array.from(genres).sort(),
      years: Array.from(years).sort((a, b) => b - a), // Descending order for years
      languages: Array.from(languages).sort()
    };
  }, [movies]);

  // Refetch all movies
  const refetch = () => {
    setLastVisible(null);
    return fetchMovies(true);
  };

  return {
    movies,
    isLoading,
    error,
    filters,
    hasMore,
    loadMore,
    updateFilters,
    resetFilters,
    deleteMovie,
    getFilterOptions,
    refetch
  };
};

export default useMovies;