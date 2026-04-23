import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

const defaultCategories = ['Health', 'Work', 'Personal', 'Mind', 'Finance'];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Sync habits and categories with Firestore
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    // Sync Habits
    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const qHabits = query(habitsRef, orderBy('createdAt', 'desc'));
    const unsubHabits = onSnapshot(qHabits, (snapshot) => {
      setHabits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Sync Custom Categories
    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    const unsubCats = onSnapshot(categoriesRef, (snapshot) => {
      setCustomCategories(snapshot.docs.map(doc => doc.data().name));
    });

    return () => {
      unsubHabits();
      unsubCats();
    };
  }, [user]);

  const addCategory = async (name) => {
    if (!user || !name) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'categories'), {
        name: name.trim(),
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const addHabit = async (habitData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'habits'), {
        ...habitData,
        streak: 0,
        completedDays: [],
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding habit: ", error);
    }
  };

  const toggleHabit = async (habitId) => {
    if (!user) return;
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDays.includes(today);
    
    let newCompletedDays = [...habit.completedDays];
    let newStreak = habit.streak || 0;

    if (isCompletedToday) {
      newCompletedDays = newCompletedDays.filter(d => d !== today);
      newStreak = Math.max(0, newStreak - 1);
    } else {
      newCompletedDays.push(today);
      newStreak += 1;
    }

    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
      await updateDoc(habitRef, {
        completedDays: newCompletedDays,
        streak: newStreak,
      });
    } catch (error) {
      console.error("Error toggling habit: ", error);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!user) return;
    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error("Error deleting habit: ", error);
    }
  };

  return (
    <HabitContext.Provider value={{ 
      habits, 
      addHabit, 
      toggleHabit, 
      deleteHabit, 
      loading,
      customCategories,
      defaultCategories,
      addCategory
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
