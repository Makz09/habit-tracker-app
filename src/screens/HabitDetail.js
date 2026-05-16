import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, Flame, Check, Clock, Leaf, Target, Edit3, Trash2 } from 'lucide-react-native';
import { theme } from '../theme';
import { useHabits } from '../context/HabitContext';
import AddHabitModal from '../components/habit/AddHabitModal';

const HabitDetail = ({ route, navigation }) => {
  const { habitId } = route.params;
  const { habits, deleteHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);
  
  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Habit not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            await deleteHabit(habit.id);
            navigation.goBack();
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Calculate longest streak from completedDays
  const getLongestStreak = () => {
    const completed = habit.completedDays || [];
    if (completed.length === 0) return { length: 0, endDate: null };

    // Sort dates chronologically
    const sorted = [...completed].sort();
    
    let longest = 1;
    let longestEnd = sorted[0];
    let current = 1;
    let currentEnd = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffMs = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        current++;
        currentEnd = sorted[i];
      } else if (diffDays > 1) {
        current = 1;
        currentEnd = sorted[i];
      }
      // diffDays === 0 means duplicate, skip

      if (current > longest) {
        longest = current;
        longestEnd = currentEnd;
      }
    }

    return { length: longest, endDate: longestEnd };
  };

  const longestStreak = getLongestStreak();

  // Format the date when the longest streak was achieved
  const getLongestStreakLabel = () => {
    if (!longestStreak.endDate) return 'No data yet';
    const date = new Date(longestStreak.endDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `Achieved in ${month} ${year}`;
  };

  // Dynamic status message based on current streak
  const getStreakStatus = () => {
    const streak = habit.streak || 0;
    if (streak === 0) return 'Start your streak today!';
    if (streak < 3) return 'Heating up!';
    if (streak < 7) return 'On a roll!';
    if (streak < 14) return 'Unstoppable!';
    if (streak < 30) return 'Legendary streak!';
    return 'Hall of Fame! 🏆';
  };

  // Logic to determine which days were completed this week
  const getWeeklyStats = () => {
    const stats = [];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      stats.push({
        day: days[i],
        completed: habit.completedDays?.includes(dateStr),
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isFuture: d > new Date()
      });
    }
    return stats;
  };

  const weeklyStats = getWeeklyStats();
  const completedThisWeek = weeklyStats.filter(s => s.completed).length;
  const consistencyScore = Math.round((completedThisWeek / 7) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{habit.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setModalVisible(true)}>
            <Edit3 color={theme.colors.primary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
            <Trash2 color="#ef4444" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Target Card (New) */}
        {habit.target && (
          <View style={[styles.statsCard, { backgroundColor: '#f0fdf4', borderColor: '#dcfce7', borderWidth: 1 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ backgroundColor: '#ffffff', padding: 10, borderRadius: 12 }}>
                <Target size={24} color="#15803d" />
              </View>
              <View>
                <Text style={[styles.cardLabel, { marginBottom: 0 }]}>DAILY TARGET</Text>
                <Text style={[styles.streakNumber, { fontSize: 24, color: '#15803d' }]}>
                  {habit.target} <Text style={{ fontSize: 16 }}>{habit.targetUnit}</Text>
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Current Streak Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardLabel}>CURRENT STREAK</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakNumber}>{habit.streak || 0}</Text>
            <Text style={styles.streakUnit}> days</Text>
          </View>
          <View style={styles.statusRow}>
            <Flame size={16} color={theme.colors.primary} />
            <Text style={styles.statusText}>{getStreakStatus()}</Text>
          </View>
        </View>

        {/* Longest Streak Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardLabel}>LONGEST STREAK</Text>
          <View style={styles.streakRow}>
            <Text style={[styles.streakNumber, { color: '#f97316' }]}>{longestStreak.length}</Text>
            <Text style={styles.streakUnit}> days</Text>
          </View>
          <Text style={styles.achievedText}>{getLongestStreakLabel()}</Text>
        </View>


        {/* Weekly Consistency Card */}
        <View style={styles.whiteCard}>
          <View style={styles.consistencyHeader}>
            <View>
              <Text style={styles.cardTitle}>Weekly</Text>
              <Text style={styles.cardTitle}>Consistency</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{consistencyScore}% Score</Text>
            </View>
          </View>

          <View style={styles.weeklyGrid}>
            {weeklyStats.map((item, idx) => (
              <View key={idx} style={styles.dayCol}>
                <Text style={[styles.dayLabel, item.isToday && { color: '#f97316', fontWeight: '700' }]}>{item.day}</Text>
                <View style={[
                  styles.checkSquare, 
                  item.completed && styles.checkSquareActive,
                  item.isToday && !item.completed && styles.checkSquareToday
                ]}>
                  {item.completed ? (
                    <Check size={18} color="#ffffff" />
                  ) : item.isToday ? (
                    <Clock size={18} color="#f97316" />
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          
          <Text style={styles.adviceText}>
            {completedThisWeek === 7 
              ? "Perfect week! You're unstoppable." 
              : `You've missed only ${7 - completedThisWeek} days this week. Keep it up!`}
          </Text>
        </View>

        {/* History Section */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {habit.completedDays?.slice(-3).reverse().map((dateStr, idx) => {
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <View key={idx} style={styles.historyItem}>
                <View style={styles.historyIconBox}>
                  <Leaf size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.historyContent}>
                  <View style={styles.historyTopRow}>
                    <Text style={styles.historyDate}>{dayName}, {formattedDate}</Text>
                    <Text style={styles.historyTime}>08:30 AM</Text>
                  </View>
                  <Text style={styles.historyNote}>
                    {idx === 0 ? "Felt very calm today. Focused on breathwork for 15 minutes." : "No notes added."}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      <AddHabitModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        habit={habit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 20,
    color: theme.colors.onSurface,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardLabel: {
    ...theme.typography.labelCaps,
    color: '#94a3b8',
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  streakNumber: {
    ...theme.typography.displayXl,
    fontSize: 44,
    color: theme.colors.primary,
    lineHeight: undefined, // Let baseline alignment handle it
  },
  streakUnit: {
    ...theme.typography.headlineMd,
    fontSize: 24,
    color: '#94a3b8',
    lineHeight: undefined, // Let baseline alignment handle it
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    ...theme.typography.bodyMd,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  achievedText: {
    ...theme.typography.bodyMd,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    elevation: 2,
  },
  consistencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitle: {
    ...theme.typography.headlineLg,
    fontSize: 26,
    color: theme.colors.onSurface,
    lineHeight: 30,
  },
  scoreBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    ...theme.typography.labelBold,
    color: '#15803d',
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCol: {
    alignItems: 'center',
    gap: 12,
  },
  dayLabel: {
    ...theme.typography.labelCaps,
    fontSize: 10,
    color: '#94a3b8',
  },
  checkSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkSquareActive: {
    backgroundColor: '#15803d',
  },
  checkSquareToday: {
    borderWidth: 2,
    borderColor: '#f97316',
    backgroundColor: 'transparent',
  },
  adviceText: {
    ...theme.typography.bodyMd,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    ...theme.typography.headlineMd,
    fontSize: 24,
  },
  viewAllText: {
    ...theme.typography.labelBold,
    color: theme.colors.primary,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
    gap: 12,
  },
  historyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  historyDate: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurface,
  },
  historyTime: {
    ...theme.typography.bodySm,
    color: '#94a3b8',
  },
  historyNote: {
    ...theme.typography.bodySm,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default HabitDetail;
