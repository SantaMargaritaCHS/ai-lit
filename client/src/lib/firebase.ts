// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "ai-literacy-platform-175d4.firebaseapp.com",
  databaseURL: "https://ai-literacy-platform-175d4-default-rtdb.firebaseio.com",
  projectId: "ai-literacy-platform-175d4",
  storageBucket: "ai-literacy-platform-175d4.firebasestorage.app",
  messagingSenderId: "857157863135",
  appId: "1:857157863135:web:04e3e62d900e591bb08b6a",
  measurementId: "G-W3JM116X32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;