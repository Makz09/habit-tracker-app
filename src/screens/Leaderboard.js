import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trophy, Star, Medal, Zap, Award, Crown, Flame, Shield, Rocket, CheckCircle2, Globe } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';

import { theme } from '../theme';
import { db } from '../config/firebase';
import Avatar from '../components/common/Avatar';

const MILESTONES_CONFIG = [
  { id: 1, title: 'Habit Starter', target: 1, type: 'completions', icon: Rocket, color: '#fca5a5' },
  { id: 2, title: 'Perfect Week', target: 7, type: 'streak', icon: Star, color: '#22c55e' },
  { id: 3, title: 'Double Digits', target: 10, type: 'completions', icon: Medal, color: '#60a5fa' },
  { id: 4, title: 'Momentum', target: 14, type: 'streak', icon: Zap, color: '#eab308' },
  { id: 5, title: '30-Day Warrior', target: 30, type: 'streak', icon: Award, color: '#f97316' },
  { id: 6, title: 'Consistency King', target: 50, type: 'completions', icon: Crown, color: '#a855f7' },
  { id: 7, title: 'On Fire', target: 60, type: 'streak', icon: Flame, color: '#ef4444' },
  { id: 8, title: 'Century Club', target: 100, type: 'completions', icon: CheckCircle2, color: '#3b82f6' },
  { id: 9, title: 'Half-Year Hero', target: 180, type: 'streak', icon: Shield, color: '#14b8a6' },
  { id: 10, title: 'Grandmaster', target: 500, type: 'completions', icon: Trophy, color: '#eab308' },
];

const Leaderboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const habitsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'habits'));
        
        let totalCompletions = 0;
        let maxStreak = 0;
        
        habitsSnapshot.forEach(habitDoc => {
          const habit = habitDoc.data();
          totalCompletions += habit.completedDays?.length || 0;
          if ((habit.streak || 0) > maxStreak) maxStreak = habit.streak;
        });

        const unlockedMilestones = MILESTONES_CONFIG.filter(m => {
          const currentValue = m.type === 'streak' ? maxStreak : totalCompletions;
          return currentValue >= m.target;
        }).map(m => {
          if (m.id === 6 && userData.gender?.toLowerCase() === 'female') {
            return { ...m, title: 'Consistency Queen' };
          }
          return m;
        });

        usersData.push({
          id: userDoc.id,
          name: userData.displayName || userData.name || 'Anonymous User',
          email: userData.email,
          photoURL: userData.photoURL,
          totalCompletions,
          maxStreak,
          unlockedMilestones,
        });
      }

      // Sort by total completions descending
      usersData.sort((a, b) => b.totalCompletions - a.totalCompletions);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.userCard}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <View style={styles.userInfoContainer}>
        <Avatar uri={item.photoURL} size={50} style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.userStats}>{item.totalCompletions} Completions • {item.maxStreak} Day Streak</Text>
        </View>
      </View>

      {item.unlockedMilestones.length > 0 && (
        <View style={styles.badgesContainer}>
          {item.unlockedMilestones.map(m => {
            const IconComp = m.icon;
            return (
              <View key={m.id} style={[styles.badgeIcon, { backgroundColor: m.color }]}>
                <IconComp size={12} color="#ffffff" />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Globe size={24} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Global Leaderboard</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Gathering ranks...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    ...theme.typography.bodyMd,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontWeight: 'bold',
    color: '#64748b',
    fontSize: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
    paddingRight: 40, // Space for rank badge
  },
  userName: {
    ...theme.typography.labelBold,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 4,
  },
  userStats: {
    ...theme.typography.bodySm,
    color: '#64748b',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Leaderboard;
