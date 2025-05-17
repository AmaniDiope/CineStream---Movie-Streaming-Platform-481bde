import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";

const useMovie = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie data
  const fetchMovie = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const movieDoc = await getDoc(doc(db, "movies", movieId));
      
      if (!movieDoc.exists()) {
        throw new Error("Movie not found");
      }

      const movieData = {
        id: movieDoc.id,
        ...movieDoc.data()
      };

      // Get download URLs for video and poster if they exist
      if (movieData.videoPath) {
        const videoUrl = await getDownloadURL(ref(storage, movieData.videoPath));
        movieData.videoUrl = videoUrl;
      }

      if (movieData.posterPath) {
        const posterUrl = await getDownloadURL(ref(storage, movieData.posterPath));
        movieData.posterUrl = posterUrl;
      }

      setMovie(movieData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching movie:", err);
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  // Update movie data
  const updateMovie = async (updateData) => {
    try {
      setIsLoading(true);
      setError(null);

      const movieRef = doc(db, "movies", movieId);
      
      // Handle file uploads if included in update
      if (updateData.newVideoFile) {
        const videoRef = ref(storage, `movies/${movieId}/video`);
        await uploadBytes(videoRef, updateData.newVideoFile);
        const videoUrl = await getDownloadURL(videoRef);
        updateData.videoPath = `movies/${movieId}/video`;
        updateData.videoUrl = videoUrl;
        delete updateData.newVideoFile;
      }

      if (updateData.newPosterFile) {
        const posterRef = ref(storage, `movies/${movieId}/poster`);
        await uploadBytes(posterRef, updateData.newPosterFile);
        const posterUrl = await getDownloadURL(posterRef);
        updateData.posterPath = `movies/${movieId}/poster`;
        updateData.posterUrl = posterUrl;
        delete updateData.newPosterFile;
      }

      await updateDoc(movieRef, updateData);
      
      // Refresh movie data
      await fetchMovie();
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error updating movie:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete movie and associated files
  const deleteMovie = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Delete associated files from storage
      if (movie.videoPath) {
        const videoRef = ref(storage, movie.videoPath);
        await deleteObject(videoRef);
      }

      if (movie.posterPath) {
        const posterRef = ref(storage, movie.posterPath);
        await deleteObject(posterRef);
      }

      // Delete movie document
      await deleteDoc(doc(db, "movies", movieId));
      
      setMovie(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Error deleting movie:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Increment view count
  const incrementViews = async () => {
    try {
      const movieRef = doc(db, "movies", movieId);
      await updateDoc(movieRef, {
        views: (movie.views || 0) + 1
      });
      setMovie(prev => ({
        ...prev,
        views: (prev.views || 0) + 1
      }));
    } catch (err) {
      console.error("Error incrementing views:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId, fetchMovie]);

  return {
    movie,
    isLoading,
    error,
    updateMovie,
    deleteMovie,
    incrementViews,
    refetch: fetchMovie
  };
};

export default useMovie;