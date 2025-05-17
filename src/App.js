import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import WatchMovie from "./pages/WatchMovie";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import MoviesList from "./pages/admin/MoviesList";
import UploadMovie from "./pages/admin/UploadMovie";
import EditMovie from "./pages/admin/EditMovie";

// AuthRoute component for protected routes
const AuthRoute = ({ children }) => {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  useEffect(() => {
    // Add Tailwind CSS script to head
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// Admin Layout without Header/Footer
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <AppLayout>
                <MovieDetails />
              </AppLayout>
            }
          />
          <Route
            path="/watch/:id"
            element={
              <AppLayout>
                <WatchMovie />
              </AppLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AuthRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <AuthRoute>
                <AdminLayout>
                  <MoviesList />
                </AdminLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <AuthRoute>
                <AdminLayout>
                  <UploadMovie />
                </AdminLayout>
              </AuthRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <AuthRoute>
                <AdminLayout>
                  <EditMovie />
                </AdminLayout>
              </AuthRoute>
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                  <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                  <p className="text-gray-400 mb-6">
                    The page you are looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Return Home
                  </a>
                </div>
              </AppLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;