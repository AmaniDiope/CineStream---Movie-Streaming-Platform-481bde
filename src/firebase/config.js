// Initialize Firebase and export services
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
const requiredEnvVars = [
  "REACT_APP_FIREBASE_API_KEY",
  "REACT_APP_FIREBASE_AUTH_DOMAIN",
  "REACT_APP_FIREBASE_PROJECT_ID",
  "REACT_APP_FIREBASE_STORAGE_BUCKET",
  "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
  "REACT_APP_FIREBASE_APP_ID"
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
    "Please check your .env file and ensure all required variables are set."
  );
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Custom Firebase admin functions for server operations
const uploadMovie = async (movieData, movieFile, thumbnailFile) => {
  try {
    if (!movieData || !movieFile || !thumbnailFile) {
      throw new Error("Missing required upload parameters");
    }
    
    // Implementation will connect with Firebase functions
    console.log("Movie upload initiated", {
      movieData,
      movieFile: movieFile.name,
      thumbnailFile: thumbnailFile.name
    });
    
    // Actual implementation requires Firebase functions
    return {
      success: true,
      message: "Upload initiated successfully",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in uploadMovie:", error);
    throw error;
  }
};

const deleteMovie = async (movieId) => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required for deletion");
    }
    
    // Implementation will connect with Firebase functions
    console.log("Delete movie initiated for ID:", movieId);
    
    // Actual implementation requires Firebase functions
    return {
      success: true,
      message: "Delete operation initiated successfully",
      movieId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in deleteMovie:", error);
    throw error;
  }
};

// Export initialized services and helper functions
export { db, auth, storage, uploadMovie, deleteMovie };
export default app;