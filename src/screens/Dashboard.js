import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';
import { theme } from '../theme';
import HabitCard from '../components/habit/HabitCard';
import { useHabits } from '../context/HabitContext';
import { Plus, Flame, Droplets, MoreVertical } from 'lucide-react-native';
import AddHabitModal from '../components/habit/AddHabitModal';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Dashboard = ({ navigation }) => {
  const { habits, toggleHabit, loading: habitsLoading } = useHabits();
  const { user, logout, loading: authLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [timeRange, setTimeRange] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'
  const today = new Date().toISOString().split('T')[0];

  const handleMorePress = () => {
    Alert.alert(
      "Account Settings",
      `Signed in as ${user?.email}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", onPress: handleLogout, style: "destructive" }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const isHabitCompletedToday = (habit) => habit.completedDays?.includes(today) || false;

  // Progress Calculation Logic
  const calculateProgress = () => {
    if (habits.length === 0) return { percent: 0, text: 'No habits yet', label: 'DAILY PROGRESS' };

    const now = new Date();
    let daysCount = 1;
    let label = 'DAILY PROGRESS';

    if (timeRange === 'weekly') {
      daysCount = 7;
      label = 'WEEKLY PROGRESS';
    } else if (timeRange === 'monthly') {
      daysCount = 30;
      label = 'MONTHLY PROGRESS';
    } else if (timeRange === 'yearly') {
      daysCount = 365;
      label = 'YEARLY PROGRESS';
    }

    if (timeRange === 'daily') {
      const completedCount = habits.filter(isHabitCompletedToday).length;
      const progress = completedCount / habits.length;
      return { 
        percent: Math.round(progress * 100), 
        text: `${completedCount} of ${habits.length} habits done`,
        label
      };
    }

    const startDate = new Date();
    startDate.setDate(now.getDate() - daysCount);
    
    let totalCompletions = 0;
    habits.forEach(habit => {
      const completionsInRange = habit.completedDays?.filter(d => new Date(d) >= startDate).length || 0;
      totalCompletions += completionsInRange;
    });

    const totalPossible = habits.length * daysCount;
    const progress = totalCompletions / totalPossible;
    
    return { 
      percent: Math.round(progress * 100), 
      text: `${totalCompletions} completions this ${timeRange.replace('ly', '')}`,
      label
    };
  };

  const progressData = calculateProgress();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar uri={user?.photoURL} size={44} style={{ marginRight: 12 }} />
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.brandName} numberOfLines={1}>{user?.displayName || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={handleMorePress}>
              <MoreVertical size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting & Quote */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Good morning, {user?.displayName?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.quoteText}>
            "Success is the sum of small efforts, repeated day in and day out."
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
            <TouchableOpacity 
              key={range}
              style={[styles.rangeTab, timeRange === range && styles.activeRangeTab]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[styles.rangeTabText, timeRange === range && styles.activeRangeTabText]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextSection}>
            <Text style={styles.progressLabel}>{progressData.label}</Text>
            <Text style={styles.progressValue}>{progressData.text}</Text>
            <Text style={styles.progressSubtext}>You're doing great! Keep it up.</Text>
          </View>
          <View style={styles.progressCircleContainer}>
            <Svg width="80" height="80" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke="#eff6ff"
                strokeWidth="10"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="40"
                stroke={theme.colors.primary}
                strokeWidth="10"
                strokeDasharray={`${(progressData.percent / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <View style={styles.progressAbsoluteLabel}>
              <Text style={styles.progressCircleText}>{progressData.percent}%</Text>
            </View>
          </View>
        </View>

        {/* Streaks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Streaks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.streaksContainer}>
          {habits.length === 0 ? (
            <View style={styles.streakCard}>
              <Text style={styles.streakHabitName}>No streaks yet</Text>
              <Text style={styles.streakDays}>Start a habit!</Text>
            </View>
          ) : (
            habits.slice(0, 3).map(habit => (
              <TouchableOpacity 
                key={habit.id} 
                style={styles.streakCard}
                onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              >
                <View style={[styles.streakIconBox, { backgroundColor: habit.category === 'Health' ? '#fff1e6' : '#e0f2fe' }]}>
                  <Flame size={20} color={habit.category === 'Health' ? '#f97316' : '#0ea5e9'} />
                </View>
                <Text style={styles.streakHabitName} numberOfLines={1}>{habit.name}</Text>
                <Text style={[styles.streakDays, { color: habit.category === 'Health' ? '#f97316' : '#0ea5e9' }]}>
                  {habit.streak || 0} days
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Today's Habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
        </View>
        <View style={styles.habitsList}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No habits for today. Start fresh!</Text>
            </View>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                name={habit.name}
                streak={habit.streak}
                completed={isHabitCompletedToday(habit)}
                onToggle={() => toggleHabit(habit.id)}
                onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus color="#ffffff" size={32} />
      </TouchableOpacity>

      <AddHabitModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.margin,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
  },
  iconBtn: {
    padding: 8,
  },
  greetingSection: {
    marginBottom: theme.spacing.md,
  },
  greetingText: {
    ...theme.typography.headlineLg,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.lg,
    padding: 4,
    marginBottom: theme.spacing.lg,
    elevation: 1,
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius.md,
  },
  activeRangeTab: {
    backgroundColor: theme.colors.primary,
  },
  rangeTabText: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  activeRangeTabText: {
    color: '#ffffff',
  },
  quoteText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  progressCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  progressTextSection: {
    flex: 1,
  },
  progressLabel: {
    ...theme.typography.labelCaps,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  progressValue: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  progressSubtext: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurfaceVariant,
  },
  progressCircleContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressAbsoluteLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleText: {
    ...theme.typography.labelBold,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
  },
  viewAllText: {
    ...theme.typography.labelBold,
    color: theme.colors.secondary,
  },
  streaksContainer: {
    marginBottom: theme.spacing.xl,
  },
  streakCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginRight: theme.spacing.md,
    width: 140,
    alignItems: 'flex-start',
    elevation: 1,
  },
  streakIconBox: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  streakHabitName: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  streakDays: {
    ...theme.typography.headlineMd,
    fontSize: 20,
  },
  habitsList: {
    gap: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.margin,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default Dashboard;
