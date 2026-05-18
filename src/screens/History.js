import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Calendar, History as HistoryIcon, Droplets, BookOpen, Activity, Heart, Brain, Users, Layout, Sparkles, Dumbbell, TrendingUp } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { getHabitDisplay } from '../utils/helpers';

const generateHabitPhrase = (name, dateString) => {
  const n = (name || '').toLowerCase();
  
  // Use the date and name length to pick a deterministic but varying quote per day
  const dateSeed = dateString ? new Date(dateString).getDate() : 1;
  const seed = n.length + dateSeed;
  
  const getQuote = (array) => array[seed % array.length];

  if (n.includes('water') || n.includes('hydrate') || n.includes('drink')) {
    return getQuote([
      "Staying hydrated! Reached your water intake goal.",
      "H2O champion! Your body thanks you for the hydration.",
      "Water logged! Keep maintaining that healthy fluid balance.",
      "Gulp, gulp! Successfully hit your hydration target today.",
      "Clear mind, hydrated body. Great job sticking to it.",
      "Flushing out toxins and staying energized. Perfect!",
      "Hydration station complete. You're crushing it.",
      "A well-hydrated body is a happy body. Excellent work.",
      "Quenched! You're keeping those energy levels up.",
      "Consistency is key, and your hydration is on point."
    ]);
  }
  
  if (n.includes('fit') || n.includes('workout') || n.includes('run') || n.includes('walk') || n.includes('gym')) {
    return getQuote([
      "Pushed your limits! Another great workout in the books.",
      "Endorphins unlocked! Way to get your body moving today.",
      "Stronger every day. You crushed that physical activity.",
      "Sweat equity invested! Great job showing up for yourself.",
      "Making gains and taking names. Awesome consistency!",
      "Your body is your temple. Way to treat it right today.",
      "Heart rate up, stress down. Excellent session.",
      "No excuses today! You put in the work and got it done.",
      "Building a stronger, healthier version of you.",
      "Way to keep the physical momentum rolling!"
    ]);
  }

  if (n.includes('work') || n.includes('product') || n.includes('code')) {
    return getQuote([
      "Crushed it! Made solid progress on your tasks today.",
      "Deep focus activated. You accomplished some great work.",
      "Checking off boxes and getting things done. Excellent!",
      "Productivity mode: ON. You really moved the needle.",
      "In the zone! Way to stay dedicated to your goals.",
      "Another step closer to your big objectives. Great job.",
      "Laser-focused session. Your future self thanks you.",
      "Procrastination defeated! You put in solid effort.",
      "Building your empire, one productive session at a time.",
      "Highly effective day. Way to maintain your workflow."
    ]);
  }

  if (n.includes('meditat') || n.includes('mind') || n.includes('journal')) {
    return getQuote([
      "Took a moment for yourself. Mind feels clear and present.",
      "Centered and grounded. A beautiful mindfulness session.",
      "Inner peace prioritized. Great job taking a breath.",
      "Calmed the noise. Way to invest in your mental clarity.",
      "A peaceful pause in a busy world. Excellent practice.",
      "Nourishing the soul. Your mental health matters.",
      "Finding balance and staying present. Beautiful work.",
      "Tuned out the chaos, tuned into yourself.",
      "Mindful progress. You're building a resilient mindset.",
      "Taking a deep breath and letting go. Well done."
    ]);
  }

  if (n.includes('read') || n.includes('book') || n.includes('study')) {
    return getQuote([
      "Expanded your mind. Great focus on your learning session.",
      "Knowledge is power! Way to invest in your growth.",
      "Lost in the pages. A fantastic reading habit.",
      "Leveling up your brain! Great job picking up that book.",
      "Feeding your curiosity. Excellent dedication to learning.",
      "Another chapter down, another lesson learned.",
      "Sharpening the saw. Your mind is getting stronger.",
      "Words are magic. Way to make time for reading.",
      "A reader today, a leader tomorrow. Keep it up!",
      "Expanding your horizons with every page turned."
    ]);
  }
  
  // 15 Generic fallbacks for any other habit
  return getQuote([
    `Completed the ${name} routine. Maintained focus and consistency.`,
    `Great job! Another step forward with ${name}.`,
    `Successfully checked off ${name} for today. Keep it up!`,
    `Momentum is building. You nailed ${name} today.`,
    `Small steps lead to massive results. Excellent work.`,
    `Consistency is your superpower. Way to stick to it.`,
    `Showing up is half the battle, and you won today.`,
    `Building a better you, one habit at a time.`,
    `You made a promise to yourself and kept it. Proud of you!`,
    `Day by day, brick by brick. You're building a solid foundation.`,
    `Habit locked in! You're making progress look easy.`,
    `Dedication pays off. Another successful completion.`,
    `You didn't skip it! That's how real progress is made.`,
    `Checked and done. Enjoy the satisfaction of a finished task.`,
    `Stacking those wins! Outstanding commitment today.`
  ]);
};

const History = () => {
  const { user } = useAuth();
  const { habits } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate week dates (Sunday to Saturday of the current week)
  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Get habits completed on selected date
  const completedToday = habits.filter(h => h.completedDays && h.completedDays.includes(selectedDateString));
  
  // Calculate stats
  const totalHabitsCount = habits.length > 0 ? habits.length : 1; // avoid division by zero
  const successRate = Math.round((completedToday.length / totalHabitsCount) * 100);

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getWeekNumber = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const pastDaysOfMonth = date.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const weekNum = Math.ceil((pastDaysOfMonth + firstDayWeekday) / 7);
    return weekNum.toString().padStart(2, '0');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <HistoryIcon size={24} color="#0f172a" style={styles.calendarIcon} />
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >

        {/* Date Header */}
        <View style={styles.dateHeaderRow}>
          <Text style={styles.monthYearText}>{formatMonthYear(selectedDate)}</Text>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>Week {getWeekNumber(selectedDate)}</Text>
          </View>
        </View>

        {/* Horizontal Calendar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          {weekDates.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const dayNum = date.getDate();
            
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>{dayName}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>{dayNum}</Text>
                {isSelected && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SUCCESS RATE</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValueGreen}>{successRate}%</Text>
              <TrendingUp size={16} color="#22c55e" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL HABITS</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValueBlue}>{completedToday.length}</Text>
              <Text style={styles.statSubText}> done</Text>
            </View>
          </View>
        </View>

        {/* Activity Log */}
        <Text style={styles.sectionTitle}>ACTIVITY LOG</Text>
        
        <View style={styles.timeline}>
          {completedToday.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No habits completed on this day.</Text>
            </View>
          ) : (
            completedToday.map((habit, index) => {
              const display = getHabitDisplay(habit.name, habit.category);
              const IconComp = display.icon;
              
              return (
                <View key={habit.id} style={styles.timelineItem}>
                  {/* Line connecting items */}
                  {index !== completedToday.length - 1 && <View style={styles.timelineLine} />}
                  
                  {/* Timeline Node */}
                  <View style={[styles.timelineNode, { backgroundColor: display.bg }]}>
                    <IconComp size={16} color={display.color} />
                  </View>
                  
                  {/* Card Content */}
                  <View style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle}>{habit.name}</Text>
                      {/* Simulated time based on index for visual effect */}
                      <Text style={styles.activityTime}>{(7 + index).toString().padStart(2, '0')}:30 AM</Text>
                    </View>
                    
                    <Text style={styles.activityDesc}>
                      {habit.description || generateHabitPhrase(habit.name, selectedDateString)}
                    </Text>
                    
                    <View style={styles.tagsRow}>
                      <View style={[styles.tag, { backgroundColor: display.lightBg }]}>
                        <Text style={[styles.tagText, { color: display.darkColor }]}>
                          {(habit.category || 'GENERAL').toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.streakTag}>
                        <Text style={styles.streakTagText}>{habit.streak || 1} DAY STREAK</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Momentum Banner */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop' }}
          style={styles.momentumBanner}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.momentumOverlay}>
            <Text style={styles.momentumTitle}>Keep up the momentum</Text>
            <Text style={styles.momentumSubtitle}>You have completed {habits.reduce((acc, h) => acc + (h.completedDays?.length || 0), 0)} habits total.</Text>
          </View>
        </ImageBackground>

      </ScrollView>
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
  calendarIcon: {
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  monthYearText: {
    ...theme.typography.headlineLg,
    fontSize: 24,
    color: '#0f172a',
  },
  weekBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weekBadgeText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  calendarScroll: {
    paddingBottom: 24,
    gap: 8,
  },
  dayCard: {
    width: 60,
    height: 80,
    backgroundColor: '#e2e8f0', 
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayCardSelected: {
    backgroundColor: '#22c55e', 
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#ffffff',
    opacity: 0.9,
  },
  dayNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  dayNumSelected: {
    color: '#ffffff',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValueGreen: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  statValueBlue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statSubText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 16,
    marginBottom: 32,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    bottom: -8,
    width: 2,
    backgroundColor: '#e2e8f0',
    zIndex: 1,
  },
  timelineNode: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activityCard: {
    marginLeft: 48,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  activityTime: {
    fontSize: 10,
    color: '#94a3b8',
  },
  activityDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  streakTag: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  streakTagText: {
    color: '#ea580c',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  momentumBanner: {
    width: '100%',
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  momentumOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)', 
    padding: 20,
    paddingTop: 40,
  },
  momentumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  momentumSubtitle: {
    fontSize: 12,
    color: '#e2e8f0',
  },
});

export default History;
