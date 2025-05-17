import React, { useState, useCallback, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const UploadMovie = () => {
  const navigate = useNavigate();
  const videoInputRef = useRef();
  const posterInputRef = useRef();
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("English");
  const [runtime, setRuntime] = useState("");
  const [quality, setQuality] = useState("HD");
  
  // File uploads
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  
  // UI states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ video: 0, poster: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("video/")) {
      setVideoFile(file);
    } else {
      setErrorMessage("Please upload a valid video file");
      setVideoFile(null);
    }
  };
  
  // Handle poster image selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("image/")) {
      setPosterFile(file);
    } else {
      setErrorMessage("Please upload a valid image file");
      setPosterFile(null);
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

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setYear("");
    setDirector("");
    setCast("");
    setGenres([]);
    setTags("");
    setLanguage("English");
    setRuntime("");
    setQuality("HD");
    setVideoFile(null);
    setPosterFile(null);
    setTrailerUrl("");
    
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (posterInputRef.current) posterInputRef.current.value = "";
    
    setUploadProgress({ video: 0, poster: 0 });
  };

  // Upload files and movie data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title || !description || !year || !videoFile) {
      setErrorMessage("Please fill in all required fields and upload a video file");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Generate a timestamp-based ID for unique file names
      const timestamp = Date.now();
      const movieId = `movie_${timestamp}`;
      
      // Upload video file
      const videoRef = ref(storage, `movies/${movieId}/video`);
      const videoUploadTask = uploadBytesResumable(videoRef, videoFile);
      
      // Track video upload progress
      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(prev => ({ ...prev, video: progress }));
        },
        (error) => {
          setErrorMessage(`Error uploading video: ${error.message}`);
          setIsUploading(false);
        }
      );

      // Wait for video upload to complete
      await videoUploadTask;
      const videoURL = await getDownloadURL(videoRef);
      
      // Upload poster if provided
      let posterURL = "";
      if (posterFile) {
        const posterRef = ref(storage, `movies/${movieId}/poster`);
        const posterUploadTask = uploadBytesResumable(posterRef, posterFile);
        
        // Track poster upload progress
        posterUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(prev => ({ ...prev, poster: progress }));
          },
          (error) => {
            setErrorMessage(`Error uploading poster: ${error.message}`);
            // Continue with adding the movie data even if poster upload fails
          }
        );
        
        await posterUploadTask;
        posterURL = await getDownloadURL(posterRef);
      }
      
      // Process tags and cast from string to array
      const tagsArray = tags.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
      
      const castArray = cast.split(",")
        .map(person => person.trim())
        .filter(person => person !== "");

      // Create movie document in Firestore
      const movieData = {
        title,
        description,
        year: parseInt(year),
        director,
        cast: castArray,
        genres,
        tags: tagsArray,
        language,
        runtime: runtime ? parseInt(runtime) : null,
        quality,
        videoPath: `movies/${movieId}/video`,
        posterPath: posterFile ? `movies/${movieId}/poster` : "",
        videoUrl: videoURL,
        posterUrl: posterURL,
        trailerUrl: trailerUrl || "",
        views: 0,
        dateAdded: serverTimestamp(),
        rating: 0 // Default rating
      };
      
      const docRef = await addDoc(collection(db, "movies"), movieData);
      
      setSuccessMessage(`Movie "${title}" uploaded successfully!`);
      resetForm();
      
      // Navigate to movie details after short delay
      setTimeout(() => {
        navigate(`/admin/movies/${docRef.id}`);
      }, 1500);
      
    } catch (error) {
      setErrorMessage(`Error adding movie: ${error.message}`);
      console.error("Error adding movie:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Upload New Movie</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/></svg>
            </div>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <span>{successMessage}</span>
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
                  Release Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  required
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
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
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
                value={tags}
                onChange={(e) => setTags(e.target.value)}
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
            
            {/* Video File */}
            <div className="mb-6">
              <label htmlFor="video" className="block mb-2 font-medium">
                Video File <span className="text-red-500">*</span>
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
                  {videoFile ? videoFile.name : "No file chosen"}
                </span>
              </div>
              <input
                id="video"
                type="file"
                ref={videoInputRef}
                onChange={handleVideoChange}
                accept="video/*"
                className="hidden"
                required
              />
              
              {/* Progress Bar */}
              {isUploading && uploadProgress.video > 0 && (
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
            
            {/* Poster Image */}
            <div className="mb-6">
              <label htmlFor="poster" className="block mb-2 font-medium">
                Poster Image
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
                  {posterFile ? posterFile.name : "No file chosen"}
                </span>
              </div>
              <input
                id="poster"
                type="file"
                ref={posterInputRef}
                onChange={handlePosterChange}
                accept="image/*"
                className="hidden"
              />
              
              {/* Progress Bar */}
              {isUploading && posterFile && uploadProgress.poster > 0 && (
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
              onClick={resetForm}
              disabled={isUploading}
              className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="195.88" y1="195.88" x2="173.25" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="195.88" x2="82.75" y2="173.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="60.12" y1="60.12" x2="82.75" y2="82.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 72 128 32 168 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </span>
                  <span>Upload Movie</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMovie;