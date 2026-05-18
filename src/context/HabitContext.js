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
  orderBy,
  collectionGroup,
  limit,
  where
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

const defaultCategories = ['Health', 'Work', 'Personal', 'Mind', 'Finance'];

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [communityHabits, setCommunityHabits] = useState([]);
  const [allGlobalHabits, setAllGlobalHabits] = useState([]);
  const [communityCategories, setCommunityCategories] = useState([]);
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

  // Sync Community/Global Data
  useEffect(() => {
    if (!user) {
      setAllGlobalHabits([]);
      setCommunityCategories([]);
      return;
    }

    // Community Habits (Collection Group query to get habits from ALL users)
    const allHabitsQuery = query(collectionGroup(db, 'habits'));

    const unsubCommunityHabits = onSnapshot(allHabitsQuery, (snapshot) => {
      const allHabits = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        isCommunity: true 
      }));
      setAllGlobalHabits(allHabits);
    });

    return () => {
      unsubCommunityHabits();
    };
  }, [user]);

  // Compute communityHabits and communityCategories based on allGlobalHabits
  useEffect(() => {
    const groupedHabits = {};
    const categoryCounts = {};

    allGlobalHabits.forEach(h => {
      if (h.name) {
        const normalizedName = h.name.toLowerCase().trim();
        if (!groupedHabits[normalizedName]) {
          groupedHabits[normalizedName] = { ...h, activeCount: 0 };
        }
        groupedHabits[normalizedName].activeCount += 1;
      }

      if (h.category) {
        const cat = h.category.trim();
        const normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
        categoryCounts[normalizedCat] = (categoryCounts[normalizedCat] || 0) + 1;
      }
    });

    const processedHabits = Object.values(groupedHabits)
      .filter(h => !habits.some(myH => myH.name?.toLowerCase().trim() === h.name?.toLowerCase().trim()))
      .map(h => {
        let countStr = h.activeCount.toString();
        if (h.activeCount >= 1000) {
          countStr = (h.activeCount / 1000).toFixed(1) + 'K';
        }
        return { ...h, activeCount: countStr };
      });

    const sortedCats = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

    setCommunityHabits(processedHabits);
    setCommunityCategories(sortedCats);
  }, [allGlobalHabits, habits]);

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
    if (!user) return null;
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'habits'), {
        ...habitData,
        streak: 0,
        completedDays: [],
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding habit: ", error);
      return null;
    }
  };

  const addCommunityHabit = async (communityHabit) => {
    if (!user) return;
    try {
      // Remove community metadata before adding to user's collection
      const { id, isCommunity, ...habitData } = communityHabit;
      await addHabit({
        ...habitData,
        sourceId: id, // Optional: track where it came from
      });
    } catch (error) {
      console.error("Error adding community habit: ", error);
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

  const updateHabit = async (habitId, updatedData) => {
    if (!user) return;
    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
      await updateDoc(habitRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  return (
    <HabitContext.Provider value={{ 
      habits, 
      communityHabits,
      communityCategories,
      addHabit, 
      addCommunityHabit,
      toggleHabit, 
      deleteHabit, 
      updateHabit,
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

