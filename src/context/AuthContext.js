import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';

import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  deleteUser
} from 'firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore if needed
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Alex',
          photoURL: firebaseUser.photoURL || 'https://i.pravatar.cc/150?u=' + firebaseUser.uid,
          ...userDoc.data()
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', res.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    
    return res;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    try {
      // Configure with placeholder - User will replace this
      GoogleSignin.configure({
        webClientId: '359935688386-ur9meg1h4e62j8vt7g1fkteoe58h9814.apps.googleusercontent.com', 
      });
      
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      
      if (!data?.idToken) {
        throw new Error('Google Sign-In failed: No ID Token received.');
      }

      const googleCredential = GoogleAuthProvider.credential(data.idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      const { user: fbUser } = userCredential;
      const userRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          createdAt: new Date().toISOString(),
        });
      } else {
        await updateDoc(userRef, {
          photoURL: fbUser.photoURL,
          displayName: fbUser.displayName,
        });
      }

      return userCredential;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (uid, data) => {
    if (data.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    setUser(prev => ({ ...prev, ...data }));
  };


  const uploadProfilePicture = async (uid, base64String) => {
    try {
      await updateUserProfile(uid, { photoURL: base64String });
      return base64String;
    } catch (error) {
      console.error('Error saving profile picture:', error);
      Alert.alert("Error", "Failed to save profile picture to your profile.");
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  };




  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      resetPassword, 
      loginWithGoogle, 
      updateUserProfile,
      uploadProfilePicture,
      deleteAccount
    }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
