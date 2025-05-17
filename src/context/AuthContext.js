import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Create auth context
const AuthContext = createContext({
  admin: null,
  isLoading: true,
  error: null,
  loginAdmin: async () => {},
  logoutAdmin: async () => {}
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Verify if the user is an admin (you would typically check against a list of admin emails)
        const isUserAdmin = user.email?.endsWith("@admin.cinestream.com") || false;
        if (isUserAdmin) {
          setAdmin({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Admin"
          });
        } else {
          // If not an admin, sign them out
          signOut(auth);
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Admin login function
  const loginAdmin = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Verify email domain for admin
      if (!email.endsWith("@admin.cinestream.com")) {
        throw new Error("Invalid admin email domain");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setAdmin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Admin"
      });

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin logout function
  const logoutAdmin = async () => {
    try {
      setError(null);
      await signOut(auth);
      setAdmin(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Provide auth context value
  const value = {
    admin,
    isLoading,
    error,
    loginAdmin,
    logoutAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;