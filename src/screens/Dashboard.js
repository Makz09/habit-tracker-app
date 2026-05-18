import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';
import { theme } from '../theme';
import HabitCard from '../components/habit/HabitCard';
import { useHabits } from '../context/HabitContext';
import { Plus, Flame, Droplets, MoreVertical, Home } from 'lucide-react-native';
import AddHabitModal from '../components/habit/AddHabitModal';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Dashboard = ({ navigation }) => {
  const { habits, toggleHabit, loading: habitsLoading } = useHabits();
  const { user, logout, loading: authLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [timeRange, setTimeRange] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'
  const [showAllStreaks, setShowAllStreaks] = useState(false);
  const [habitsLimit, setHabitsLimit] = useState(5);
  const [refreshing, setRefreshing] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Firestore sync is already real-time, but we can simulate a manual fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);



  const isHabitCompletedToday = (habit) => habit.completedDays?.includes(today) || false;

  // Progress Calculation Logic
  const calculateProgress = () => {
    const completedToday = habits.filter(isHabitCompletedToday).length;
    const totalHabits = habits.length;
    const pendingHabits = totalHabits - completedToday;

    if (totalHabits === 0) return { percent: 0, text: 'No habits yet', label: 'DAILY PROGRESS', total: 0, completed: 0, pending: 0 };

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
      const progress = completedToday / totalHabits;
      return { 
        percent: Math.round(progress * 100), 
        text: `${completedToday} of ${totalHabits} habits done`,
        label,
        total: totalHabits,
        completed: completedToday,
        pending: pendingHabits
      };
    }

    const startDate = new Date();
    startDate.setDate(now.getDate() - daysCount);
    
    let totalCompletions = 0;
    habits.forEach(habit => {
      const completionsInRange = habit.completedDays?.filter(d => new Date(d) >= startDate).length || 0;
      totalCompletions += completionsInRange;
    });

    const totalPossible = totalHabits * daysCount;
    const progress = totalCompletions / totalPossible;
    
    return { 
      percent: Math.round(progress * 100), 
      text: `${totalCompletions} completions this ${timeRange.replace('ly', '')}`,
      label,
      total: totalHabits,
      completed: completedToday, // For daily counter
      pending: pendingHabits
    };
  };

  const progressData = calculateProgress();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Home size={24} color="#0f172a" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Home</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >

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

        {/* Dashboard Stats Summary */}
        <View style={styles.statsSummaryRow}>
          <View style={[styles.statBox, { backgroundColor: '#eff6ff' }]}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{progressData.total}</Text>
            <Text style={styles.statLabelSmall}>TOTAL</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>{progressData.completed}</Text>
            <Text style={styles.statLabelSmall}>COMPLETED</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fef2f2' }]}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{progressData.pending}</Text>
            <Text style={styles.statLabelSmall}>PENDING</Text>
          </View>
        </View>

        {/* Dynamic Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextSection}>
            <Text style={styles.progressLabel}>{progressData.label}</Text>
            <Text style={styles.progressValue}>{progressData.percent}% Complete</Text>
            <Text style={styles.progressSubtext}>{progressData.text}</Text>
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
          <TouchableOpacity onPress={() => setShowAllStreaks(!showAllStreaks)}>
            <Text style={styles.viewAllText}>{showAllStreaks ? 'View Less' : 'View All'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.streaksContainer}>
          {habits.length === 0 ? (
            <View style={styles.streakCard}>
              <Text style={styles.streakHabitName}>No streaks yet</Text>
              <Text style={styles.streakDays}>Start a habit!</Text>
            </View>
          ) : (
            habits.slice(0, showAllStreaks ? undefined : 3).map(habit => (
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.limitSelector}>
          {[5, 10, 15, 20, 25, 'All'].map(limit => (
            <TouchableOpacity 
              key={limit}
              style={[styles.limitChip, habitsLimit === limit && styles.activeLimitChip]}
              onPress={() => setHabitsLimit(limit)}
            >
              <Text style={[styles.limitText, habitsLimit === limit && styles.activeLimitText]}>
                {limit}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.habitsList}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No habits for today. Start fresh!</Text>
            </View>
          ) : (
            habits.slice(0, habitsLimit === 'All' ? undefined : habitsLimit).map(habit => (
              <HabitCard
                key={habit.id}
                name={habit.name}
                category={habit.category}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    gap: 8,
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
  },
  headerIcon: {
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
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabelSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
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
  limitSelector: {
    marginBottom: theme.spacing.md,
  },
  limitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  activeLimitChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  limitText: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  activeLimitText: {
    color: '#ffffff',
  },
});

export default Dashboard;
