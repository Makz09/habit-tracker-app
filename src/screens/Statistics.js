import React, { useMemo, useState } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Target, Award, BarChart3, Star, Lock, CheckCircle2 } from 'lucide-react-native';

import { theme } from '../theme';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');
const CARD_PADDING = theme.spacing.lg;
const CONTAINER_MARGIN = theme.spacing.margin;
const AVAILABLE_WIDTH = width - (CONTAINER_MARGIN * 2) - (CARD_PADDING * 2);
const GAP = 8;
const BOX_SIZE = (AVAILABLE_WIDTH - (6 * GAP)) / 7;

const Statistics = ({ navigation }) => {


  const { habits } = useHabits();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);


  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);

    let totalCompletions = 0;
    let maxStreak = 0;
    
    // 1. Weekly Data (Last 7 days)
    const last7DaysCompletions = [0,0,0,0,0,0,0]; 
    const previous7DaysCompletions = [0,0,0,0,0,0,0];
    
    // 2. Heatmap Data (Last 30 days)
    const heatmapCounts = new Array(30).fill(0);
    
    // 3. Categories
    const categoryCounts = {};

    habits.forEach(habit => {
      totalCompletions += habit.completedDays?.length || 0;
      if ((habit.streak || 0) > maxStreak) maxStreak = habit.streak;
      
      const cat = habit.category || 'General';
      if (!categoryCounts[cat]) categoryCounts[cat] = 0;
      categoryCounts[cat] += habit.completedDays?.length || 0;

      habit.completedDays?.forEach(dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        const completedDate = new Date(year, month - 1, day);
        
        const timeDiff = today.getTime() - completedDate.getTime();
        const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 7) {
          last7DaysCompletions[6 - diffDays]++;
        } else if (diffDays >= 7 && diffDays < 14) {
          previous7DaysCompletions[13 - diffDays]++;
        }

        if (diffDays >= 0 && diffDays < 30) {
          heatmapCounts[29 - diffDays]++;
        }
      });
    });


    const activeHabitsCount = habits.length || 1; 
    const currentWeekTotal = last7DaysCompletions.reduce((a,b)=>a+b,0);
    const previousWeekTotal = previous7DaysCompletions.reduce((a,b)=>a+b,0);
    
    const weeklyPercent = Math.round((currentWeekTotal / (activeHabitsCount * 7)) * 100);
    const prevWeeklyPercent = Math.round((previousWeekTotal / (activeHabitsCount * 7)) * 100);
    
    const trend = weeklyPercent - prevWeeklyPercent;

    let catArray = Object.keys(categoryCounts).map(k => ({
      name: k,
      count: categoryCounts[k]
    })).sort((a,b) => b.count - a.count);

    if (totalCompletions === 0) {
      catArray = [{ name: 'None', count: 1 }];
    }

    const colors = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#0ea5e9'];
    catArray = catArray.slice(0,4).map((c, i) => ({
      ...c,
      color: colors[i],
      percentage: totalCompletions === 0 ? 0 : Math.round((c.count / totalCompletions) * 100)
    }));

    const heatmapData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayNum = d.getDate();
      const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
      heatmapData.push({
        dayNum,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        count: heatmapCounts[29 - i]
      });
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const firstDay = new Date(today);
    firstDay.setDate(firstDay.getDate() - 29);
    
    const monthLabel = firstDay.getMonth() === today.getMonth() 
      ? monthNames[today.getMonth()] 
      : `${monthNames[firstDay.getMonth()]} - ${monthNames[today.getMonth()]}`;

    return {
      totalCompletions,
      bestStreak: maxStreak,
      weeklyPercent,
      trend,
      last7DaysCompletions,
      heatmapCounts,
      heatmapData,
      monthLabel,
      topCategories: catArray
    };
  }, [habits]);



  const nextMilestone = Math.ceil((stats.bestStreak + 1) / 5) * 5;
  const daysAway = nextMilestone - stats.bestStreak;

  const daysOfWeek = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    daysOfWeek.push(d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase());
  }

  const maxDailyCompletions = Math.max(...stats.last7DaysCompletions, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stats</Text>
        <BarChart3 size={24} color="#0f172a" style={styles.headerIcon} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >

        <Text style={styles.pageTitle}>Your Growth</Text>
        <Text style={styles.pageSubtitle}>Consistency is the key to progress.</Text>

        <View style={styles.whiteCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.cardTitle}>Weekly Summary</Text>
              <Text style={styles.cardSubtitle}>COMPLETION RATE</Text>
            </View>
            <View style={styles.percentageColumn}>
              <Text style={styles.percentageText}>{stats.weeklyPercent}%</Text>
              <Text style={[styles.trendText, { color: stats.trend >= 0 ? '#22c55e' : '#ef4444' }]}>
                {stats.trend >= 0 ? '+' : ''}{stats.trend}% from last week
              </Text>
            </View>
          </View>
          
          <View style={styles.miniChart}>
            {daysOfWeek.map((day, i) => {
              const count = stats.last7DaysCompletions[i];
              const height = Math.max(10, (count / maxDailyCompletions) * 70); 
              return (
                <View key={day + i} style={styles.miniBarColumn}>
                  <View style={[styles.miniBar, { height, backgroundColor: count > 0 ? '#2563eb' : '#f1f5f9' }]} />
                  <Text style={styles.miniBarLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.cardSubtitle}>LONGEST STREAK</Text>
          <View style={styles.streakDisplay}>
            <Text style={styles.largeStreakText}>{stats.bestStreak}</Text>
            <Text style={styles.largeStreakUnit}>days</Text>
          </View>
          <Text style={styles.streakAdvice}>
            {stats.bestStreak === 0 
              ? "Start building your streak today!" 
              : `Keep it up! You're ${daysAway} days away from a ${nextMilestone}-day milestone.`}
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('History')}>
            <Text style={styles.primaryButtonText}>VIEW HISTORY</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.heatmapHeader}>
            <Text style={styles.cardTitle}>Monthly Consistency</Text>
            <Text style={styles.monthLabel}>{stats.monthLabel}</Text>
          </View>

          <View style={styles.weekLabels}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Text key={`label-${i}`} style={[styles.weekLabel, (i === 0 || i === 6) && { color: '#ef4444' }]}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.heatmap}>
            {stats.heatmapData.map((item, i) => {
              let bgColor = '#f1f5f9';
              if (item.count > 0) {
                if (item.count === 1) bgColor = '#bbf7d0';
                else if (item.count === 2) bgColor = '#4ade80';
                else if (item.count === 3) bgColor = '#22c55e';
                else bgColor = '#15803d';
              }

              return (
                <View 
                  key={`heat-${i}`} 
                  style={[styles.heatBox, { backgroundColor: bgColor }]} 
                >
                  <Text style={[styles.heatText, item.isWeekend && styles.weekendText]}>
                    {item.dayNum}
                  </Text>
                </View>
              );
            })}
          </View>



          <View style={styles.heatmapLegend}>
            <Text style={styles.legendText}>Less</Text>
            <View style={styles.legendBoxes}>
              <View style={[styles.legendBox, { backgroundColor: '#f1f5f9' }]} />
              <View style={[styles.legendBox, { backgroundColor: '#bbf7d0' }]} />
              <View style={[styles.legendBox, { backgroundColor: '#4ade80' }]} />
              <View style={[styles.legendBox, { backgroundColor: '#15803d' }]} />
            </View>
            <Text style={styles.legendText}>More</Text>
          </View>

        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          {stats.topCategories.length > 0 && stats.totalCompletions > 0 ? (
            <View style={styles.breakdownContainer}>
              <View style={styles.donutChart}>
                {stats.topCategories.map((cat, i) => {
                  const positions = [
                    { top: 0, left: 0, borderTopLeftRadius: 100 },
                    { top: 0, right: 0, borderTopRightRadius: 100 },
                    { bottom: 0, left: 0, borderBottomLeftRadius: 100 },
                    { bottom: 0, right: 0, borderBottomRightRadius: 100 }
                  ];
                  return (
                    <View key={cat.name} style={[styles.donutSegment, { backgroundColor: cat.color, ...positions[i] }]} />
                  );
                })}
                <View style={styles.donutCenter}>
                  <Text style={styles.donutCenterText}>{stats.totalCompletions}</Text>
                  <Text style={{fontSize: 8, color: '#94a3b8', fontWeight: 'bold'}}>TOTAL</Text>
                </View>
              </View>
              <View style={styles.chartLegend}>
                {stats.topCategories.map(cat => (
                  <View key={cat.name} style={styles.chartLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>{cat.name}</Text>
                    <Text style={styles.legendValue}>{cat.percentage}%</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={{color: '#94a3b8', fontStyle: 'italic', marginTop: 10}}>No data available yet.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.milestonesGrid}>
          {/* Milestone 1: Perfect Week */}
          <View style={[styles.milestoneCard, stats.bestStreak < 7 && styles.milestoneCardLocked]}>
            <View style={[
              styles.milestoneBadge, 
              stats.bestStreak >= 7 ? { backgroundColor: '#22c55e', elevation: 8, shadowColor: '#22c55e' } : styles.milestoneBadgeLocked
            ]}>
              {stats.bestStreak >= 7 ? <Star size={24} color="#ffffff" /> : <Lock size={20} color="#cbd5e1" />}
            </View>
            <Text style={styles.milestoneName}>Perfect Week</Text>
            <Text style={styles.milestoneStatus}>{stats.bestStreak >= 7 ? 'ACHIEVED' : `${stats.bestStreak}/7 DAYS`}</Text>
          </View>

          {/* Milestone 2: 30-Day Warrior */}
          <View style={[styles.milestoneCard, stats.bestStreak < 30 && styles.milestoneCardLocked]}>
            <View style={[
              styles.milestoneBadge, 
              stats.bestStreak >= 30 ? { backgroundColor: '#f97316', elevation: 8, shadowColor: '#f97316' } : styles.milestoneBadgeLocked
            ]}>
              {stats.bestStreak >= 30 ? <Award size={24} color="#ffffff" /> : <Lock size={20} color="#cbd5e1" />}
            </View>
            <Text style={styles.milestoneName}>30-Day Warrior</Text>
            <Text style={styles.milestoneStatus}>{stats.bestStreak >= 30 ? 'ACHIEVED' : `${stats.bestStreak}/30 DAYS`}</Text>
          </View>

          {/* Milestone 3: Century Club */}
          <View style={[styles.milestoneCard, stats.totalCompletions < 100 && styles.milestoneCardLocked]}>
            <View style={[
              styles.milestoneBadge, 
              stats.totalCompletions >= 100 ? { backgroundColor: '#3b82f6', elevation: 8, shadowColor: '#3b82f6' } : styles.milestoneBadgeLocked
            ]}>
              {stats.totalCompletions >= 100 ? <CheckCircle2 size={24} color="#ffffff" /> : <Lock size={20} color="#cbd5e1" />}
            </View>
            <Text style={styles.milestoneName}>Century Club</Text>
            <Text style={styles.milestoneStatus}>{stats.totalCompletions >= 100 ? 'ACHIEVED' : `${stats.totalCompletions}/100 DAYS`}</Text>
          </View>

          {/* Milestone 4: Consistency King */}
          <View style={[styles.milestoneCard, stats.totalCompletions < 50 && styles.milestoneCardLocked]}>
            <View style={[
              styles.milestoneBadge, 
              stats.totalCompletions >= 50 ? { backgroundColor: '#a855f7', elevation: 8, shadowColor: '#a855f7' } : styles.milestoneBadgeLocked
            ]}>
              {stats.totalCompletions >= 50 ? <Target size={24} color="#ffffff" /> : <Lock size={20} color="#cbd5e1" />}
            </View>
            <Text style={styles.milestoneName}>Consistency King</Text>
            <Text style={styles.milestoneStatus}>{stats.totalCompletions >= 50 ? 'ACHIEVED' : `${stats.totalCompletions}/50 DONE`}</Text>
          </View>
        </View>

      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
  },
  headerIcon: {
    position: 'absolute',
    right: 20,
  },
  container: {
    padding: theme.spacing.margin,
  },
  pageTitle: {
    ...theme.typography.headlineLg,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  pageSubtitle: {
    ...theme.typography.bodyMd,
    color: '#64748b',
    marginBottom: theme.spacing.xl,
  },
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...theme.typography.labelCaps,
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  percentageColumn: {
    alignItems: 'flex-end',
  },
  percentageText: {
    ...theme.typography.displayXl,
    fontSize: 40,
    color: theme.colors.primary,
  },
  trendText: {
    ...theme.typography.bodySm,
    color: theme.colors.primary,
    fontSize: 10,
  },
  miniChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  miniBarColumn: {
    alignItems: 'center',
    gap: 8,
  },
  miniBar: {
    width: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  miniBarLabel: {
    ...theme.typography.labelCaps,
    fontSize: 8,
    color: '#94a3b8',
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  largeStreakText: {
    ...theme.typography.displayXl,
    fontSize: 48,
    color: theme.colors.onSurface,
  },
  largeStreakUnit: {
    ...theme.typography.headlineMd,
    fontSize: 24,
    color: theme.colors.onSurface,
    marginLeft: 8,
  },

  streakAdvice: {
    ...theme.typography.bodySm,
    color: '#64748b',
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...theme.typography.labelBold,
    color: '#ffffff',
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  monthLabel: {
    ...theme.typography.labelBold,
    color: '#64748b',
    fontSize: 10,
  },
  weekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  weekLabel: {
    width: BOX_SIZE,
    textAlign: 'center',
    ...theme.typography.labelCaps,
    fontSize: 9,
    color: '#94a3b8',
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
    justifyContent: 'flex-start',
  },


  heatBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  weekendText: {
    color: '#ef4444',
  },





  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: 10,
  },

  legendBoxes: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    ...theme.typography.bodySm,
    fontSize: 10,
    color: '#94a3b8',
  },
  breakdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  },
  donutSegment: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  donutCenter: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  donutCenterText: {
    ...theme.typography.labelBold,
    color: '#64748b',
  },
  chartLegend: {
    flex: 1,
    paddingLeft: 40,
    gap: 12,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendLabel: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
  charValue: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurface,
  },
  sectionTitle: {
    ...theme.typography.headlineMd,
    marginVertical: theme.spacing.lg,
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
  },
  milestoneCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  milestoneCardLocked: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    elevation: 0,
  },
  milestoneBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  milestoneBadgeLocked: {
    backgroundColor: '#f1f5f9',
  },
  milestoneName: {
    ...theme.typography.headlineMd,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
    color: '#0f172a',
  },
  milestoneStatus: {
    ...theme.typography.labelCaps,
    fontSize: 9,
    color: '#94a3b8',
    letterSpacing: 0.5,
  },

});

export default Statistics;
