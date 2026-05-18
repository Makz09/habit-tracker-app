import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2AQ4zKpIFvFXFxHy4IUOTGQt4vnrc8wg",
  authDomain: "habittrackerapp-5f3cc.firebaseapp.com",
  projectId: "habittrackerapp-5f3cc",
  storageBucket: "habittrackerapp-5f3cc.firebasestorage.app",
  messagingSenderId: "359935688386",
  appId: "1:359935688386:web:22bcca09624ea092f2055b",
  measurementId: "G-79XNGY410M"
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;