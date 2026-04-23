import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2AQ4zKpIFvFXFxHy4IUOTGQt4vnrc8wg",
  authDomain: "habittrackerapp-5f3cc.firebaseapp.com",
  projectId: "habittrackerapp-5f3cc",
  storageBucket: "habittrackerapp-5f3cc.firebasestorage.app",
  messagingSenderId: "360064971207",
  appId: "1:360064971207:web:91a788c00539b78e473e34"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with Persistence
let auth;
if (getApps().length > 0) {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };

// Initialize Firestore
export const db = getFirestore(app);

export default app;
