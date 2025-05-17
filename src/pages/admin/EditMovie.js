import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useMovie from "../../hooks/useMovie";
import { storage } from "../../firebase/config";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, isLoading, error, updateMovie } = useMovie(id);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [castString, setCastString] = useState("");
  const [genres, setGenres] = useState([]);
  const [tagsString, setTagsString] = useState("");
  const [language, setLanguage] = useState("English");
  const [runtime, setRuntime] = useState("");
  const [quality, setQuality] = useState("HD");
  const [trailerUrl, setTrailerUrl] = useState("");
  
  // File uploads
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newPosterFile, setNewPosterFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ video: 0, poster: 0 });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  
  // Refs for file inputs
  const videoInputRef = useRef();
  const posterInputRef = useRef();

  // Available genres
  const availableGenres = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "History", "Horror",
    "Music", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
  ];

  // Available qualities
  const availableQualities = ["SD", "HD", "Full HD", "4K", "8K"];
  
  // Available languages
  const availableLanguages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese",
    "Russian", "Japanese", "Chinese", "Korean", "Hindi", "Arabic", "Other"
  ];

  // Populate form with movie data when it loads
  useEffect(() => {
    if (movie) {
      setTitle(movie.title || "");
      setDescription(movie.description || "");
      setYear(movie.year?.toString() || "");
      setDirector(movie.director || "");
      setCastString(movie.cast?.join(", ") || "");
      setGenres(movie.genres || []);
      setTagsString(movie.tags?.join(", ") || "");
      setLanguage(movie.language || "English");
      setRuntime(movie.runtime?.toString() || "");
      setQuality(movie.quality || "HD");
      setTrailerUrl(movie.trailerUrl || "");
      setVideoPreview(movie.videoUrl || "");
      setPosterPreview(movie.posterUrl || "");
    }
  }, [movie]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (formSuccess || formError) {
      const timer = setTimeout(() => {
        setFormSuccess("");
        setFormError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formSuccess, formError]);

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith("video/")) {
      setNewVideoFile(file);
      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setFormError("Please upload a valid video file");
    }
  };

  // Handle poster image selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith("image/")) {
      setNewPosterFile(file);
      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setPosterPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setFormError("Please upload a valid image file");
    }
  };

  // Handle genre selection
  const handleGenreToggle = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      setFormError("Title and description are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      setFormSuccess("");

      // Prepare update data
      const updateData = {
        title,
        description,
        year: year ? parseInt(year) : null,
        director,
        cast: castString.split(",").map(item => item.trim()).filter(item => item),
        genres,
        tags: tagsString.split(",").map(item => item.trim()).filter(item => item),
        language,
        runtime: runtime ? parseInt(runtime) : null,
        quality,
        trailerUrl,
      };

      // Handle file uploads if needed
      if (newVideoFile) {
        updateData.newVideoFile = newVideoFile;
      }

      if (newPosterFile) {
        updateData.newPosterFile = newPosterFile;
      }

      // Update the movie
      const success = await updateMovie(updateData);
      
      if (success) {
        setFormSuccess("Movie updated successfully!");
        // Reset file inputs
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (posterInputRef.current) posterInputRef.current.value = "";
        // Reset file states
        setNewVideoFile(null);
        setNewPosterFile(null);
      }
    } catch (err) {
      setFormError(err.message || "Failed to update movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-900/30 border border-yellow-500 text-yellow-300 px-4 py-3 rounded mb-6">
            <p>Movie not found</p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Movie: {movie.title}</h1>
          <button
            onClick={() => navigate("/admin/movies")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Movies
          </button>
        </div>

        {formError && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
            </div>
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2">
                <label htmlFor="title" className="block mb-2 font-medium">
                  Movie Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Year */}
              <div>
                <label htmlFor="year" className="block mb-2 font-medium">
                  Release Year
                </label>
                <input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {/* Runtime */}
              <div>
                <label htmlFor="runtime" className="block mb-2 font-medium">
                  Runtime (minutes)
                </label>
                <input
                  id="runtime"
                  type="number"
                  min="1"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {/* Language */}
              <div>
                <label htmlFor="language" className="block mb-2 font-medium">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quality */}
              <div>
                <label htmlFor="quality" className="block mb-2 font-medium">
                  Quality
                </label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  {availableQualities.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Credits */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Credits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Director */}
              <div>
                <label htmlFor="director" className="block mb-2 font-medium">
                  Director
                </label>
                <input
                  id="director"
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              {/* Cast */}
              <div>
                <label htmlFor="cast" className="block mb-2 font-medium">
                  Cast (comma separated)
                </label>
                <input
                  id="cast"
                  type="text"
                  value={castString}
                  onChange={(e) => setCastString(e.target.value)}
                  placeholder="Actor 1, Actor 2, Actor 3..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Categorization */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Categorization</h2>
            
            {/* Genres */}
            <div className="mb-6">
              <label className="block mb-3 font-medium">
                Genres (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      genres.includes(genre)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block mb-2 font-medium">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="tag1, tag2, tag3..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                Additional keywords to improve searchability
              </p>
            </div>
          </div>
          
          {/* Media Files */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">Media Files</h2>
            
            {/* Current Video */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Current Video</h3>
              {videoPreview ? (
                <div className="relative aspect-video bg-gray-900">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  ></video>
                </div>
              ) : (
                <div className="p-4 bg-gray-700 rounded text-gray-400 text-center">
                  No video available
                </div>
              )}
            </div>
            
            {/* Upload New Video */}
            <div className="mb-6">
              <label htmlFor="newVideo" className="block mb-2 font-medium">
                Upload New Video (optional)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => videoInputRef.current.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Choose File
                </button>
                <span className="text-gray-300 truncate flex-1">
                  {newVideoFile ? newVideoFile.name : "No file chosen"}
                </span>
              </div>
              <input
                id="newVideo"
                type="file"
                ref={videoInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                className="hidden"
              />
              
              {/* Progress Bar for Video */}
              {isSubmitting && newVideoFile && uploadProgress.video > 0 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${uploadProgress.video}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {uploadProgress.video}% uploaded
                  </p>
                </div>
              )}
            </div>
            
            {/* Current Poster */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Current Poster</h3>
              {posterPreview ? (
                <div className="relative w-40 h-60 bg-gray-900">
                  <img
                    src={posterPreview}
                    alt={title || "Movie Poster"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-40 h-60 p-4 bg-gray-700 rounded text-gray-400 flex items-center justify-center">
                  No poster available
                </div>
              )}
            </div>
            
            {/* Upload New Poster */}
            <div className="mb-6">
              <label htmlFor="newPoster" className="block mb-2 font-medium">
                Upload New Poster (optional)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => posterInputRef.current.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Choose File
                </button>
                <span className="text-gray-300 truncate flex-1">
                  {newPosterFile ? newPosterFile.name : "No file chosen"}
                </span>
              </div>
              <input
                id="newPoster"
                type="file"
                ref={posterInputRef}
                onChange={handlePosterChange}
                accept="image/*"
                className="hidden"
              />
              
              {/* Progress Bar for Poster */}
              {isSubmitting && newPosterFile && uploadProgress.poster > 0 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${uploadProgress.poster}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {uploadProgress.poster}% uploaded
                  </p>
                </div>
              )}
            </div>
            
            {/* Trailer URL */}
            <div>
              <label htmlFor="trailer" className="block mb-2 font-medium">
                Trailer URL (YouTube or direct link)
              </label>
              <input
                id="trailer"
                type="url"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/movies")}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </span>
                  <span>Update Movie</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;