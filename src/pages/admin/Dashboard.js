import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useMovies from "../../hooks/useMovies";

const Dashboard = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  const { movies, isLoading } = useMovies();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Stats calculations
  const totalMovies = movies.length;
  const totalViews = movies.reduce((sum, movie) => sum + (movie.views || 0), 0);
  const averageRating = movies.length > 0
    ? (movies.reduce((sum, movie) => sum + (movie.rating || 0), 0) / movies.length).toFixed(1)
    : 0;

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate("/admin/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {admin?.displayName || "Admin"}
              </span>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="112 40 48 40 48 216 112 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="184 88 224 128 184 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Movies */}
          <div className="bg-gray-800 rounded-lg shadow px-6 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M40,112H216a0,0,0,0,1,0,0v88a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V112A0,0,0,0,1,40,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M40.43,112,208,67.77l-8.16-30a7.9,7.9,0,0,0-9.66-5.49L37.85,72.47A7.76,7.76,0,0,0,32.27,82Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="67.71" y1="64.59" x2="115.5" y2="92.19" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="126.61" y1="49.05" x2="174.4" y2="76.64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-400 truncate">
                  Total Movies
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {isLoading ? "..." : totalMovies}
                </p>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-gray-800 rounded-lg shadow px-6 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-400 truncate">
                  Total Views
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {isLoading ? "..." : totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-gray-800 rounded-lg shadow px-6 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M152,206.4a88,88,0,0,1,0-156.8,88,88,0,1,0,0,156.8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polygon points="173.46 128 156 98.33 188.59 106.4 210.39 80 213.06 114.65 244 128 213.06 141.35 210.39 176 188.59 149.6 156 157.67 173.46 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-400 truncate">
                  Average Rating
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {isLoading ? "..." : averageRating}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-5">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/upload"
                className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="144" x2="128" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="216 144 216 208 40 208 40 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="88 72 128 32 168 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Upload Movie</p>
                  <p className="text-gray-400 text-sm">Add a new movie</p>
                </div>
              </Link>

              <Link
                to="/admin/movies"
                className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex-shrink-0 bg-green-500 rounded-md p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="64" x2="216" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="192" x2="216" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Manage Movies</p>
                  <p className="text-gray-400 text-sm">Edit or delete movies</p>
                </div>
              </Link>

              <Link
                to="/admin/analytics"
                className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="48" y1="216" x2="48" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 56 176 56 176 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="48 104 224 104 224 152 48 152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="144 152 144 200 48 200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Analytics</p>
                  <p className="text-gray-400 text-sm">View statistics</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-5">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="mt-2 h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : movies.length > 0 ? (
              <div className="space-y-4">
                {movies.slice(0, 5).map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/admin/edit/${movie.id}`}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={movie.posterUrl || "https://images.unsplash.com/photo-1580130775562-0ef92da028de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyQnBvc3RlciUyQnRodW1ibmFpbHxlbnwwfHx8fDE3NDc0ODI4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                      alt={movie.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-gray-400 text-sm">
                        Added: {movie.dateAdded?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                No movies have been added yet
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="112 40 48 40 48 216 112 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="112" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="184 88 224 128 184 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;