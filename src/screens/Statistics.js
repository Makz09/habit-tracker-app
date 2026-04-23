import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, MoreVertical, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Statistics = () => {
  const { habits } = useHabits();
  const { user, logout } = useAuth();

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

  const totalCompletions = habits.reduce((acc, h) => acc + (h.completedDays?.length || 0), 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar uri={user?.photoURL} size={40} style={{ marginRight: 12 }} />
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.brandName} numberOfLines={1}>{user?.displayName || 'User'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={handleMorePress}>
          <MoreVertical size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Your Growth</Text>
        <Text style={styles.pageSubtitle}>Consistency is the key to progress.</Text>

        {/* Weekly Summary Card */}
        <View style={styles.whiteCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.cardTitle}>Weekly Summary</Text>
              <Text style={styles.cardSubtitle}>TOTAL COMPLETIONS</Text>
            </View>
            <View style={styles.percentageColumn}>
              <Text style={styles.percentageText}>84%</Text>
              <Text style={styles.trendText}>+12% from last week</Text>
            </View>
          </View>
          
          <View style={styles.miniChart}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
              <View key={day} style={styles.miniBarColumn}>
                <View style={[styles.miniBar, { height: [30, 50, 40, 70, 60, 45, 80][i] }]} />
                <Text style={styles.miniBarLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Longest Streak Card */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardSubtitle}>LONGEST STREAK</Text>
          <Text style={styles.largeStreakText}>{bestStreak} <Text style={styles.largeStreakUnit}>days</Text></Text>
          <Text style={styles.streakAdvice}>Keep it up! You're 3 days away from a new milestone.</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>VIEW HISTORY</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Consistency Heatmap */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Monthly Consistency</Text>
          <View style={styles.heatmap}>
            {Array.from({ length: 32 }).map((_, i) => {
              const colors = ['#f0fdf4', '#dcfce7', '#86efac', '#22c55e', '#15803d', '#166534'];
              const colorIdx = (i * 7 + 3) % colors.length;
              const bgColor = i % 7 === 2 ? '#f8fafc' : colors[colorIdx];
              
              return (
                <View 
                  key={i} 
                  style={[
                    styles.heatBox, 
                    { backgroundColor: bgColor }
                  ]} 
                />
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

        {/* Category Breakdown */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <View style={styles.donutChart}>
              <View style={[styles.donutSegment, { backgroundColor: '#22c55e', top: 0, left: 0, borderTopLeftRadius: 100 }]} />
              <View style={[styles.donutSegment, { backgroundColor: '#2563eb', top: 0, right: 0, borderTopRightRadius: 100 }]} />
              <View style={[styles.donutSegment, { backgroundColor: '#f97316', bottom: 0, left: 0, borderBottomLeftRadius: 100 }]} />
              <View style={styles.donutCenter}>
                <Text style={styles.donutCenterText}>ALL</Text>
              </View>
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.legendLabel}>Fitness</Text>
                <Text style={styles.legendValue}>40%</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
                <Text style={styles.legendLabel}>Mindfulness</Text>
                <Text style={styles.legendValue}>30%</Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
                <Text style={styles.legendLabel}>Growth</Text>
                <Text style={styles.legendValue}>30%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.milestonesGrid}>
          <View style={styles.milestoneCard}>
            <View style={[styles.milestoneBadge, { backgroundColor: '#ffedd5' }]}>
              <Award size={24} color="#f97316" />
            </View>
            <Text style={styles.milestoneName}>30-Day Warrior</Text>
            <Text style={styles.milestoneStatus}>ACHIEVED MAR 12</Text>
          </View>
          <View style={styles.milestoneCard}>
            <View style={[styles.milestoneBadge, { backgroundColor: '#dcfce7' }]}>
              <Target size={24} color="#22c55e" />
            </View>
            <Text style={styles.milestoneName}>Perfect Week</Text>
            <Text style={styles.milestoneStatus}>ACHIEVED YESTERDAY</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
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
  largeStreakText: {
    ...theme.typography.displayXl,
    fontSize: 48,
    color: theme.colors.onSurface,
    marginVertical: 8,
  },
  largeStreakUnit: {
    ...theme.typography.headlineMd,
    fontSize: 24,
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
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  heatBox: {
    width: '11%',
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
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
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxl,
  },
  milestoneCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    elevation: 1,
  },
  milestoneBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneName: {
    ...theme.typography.labelBold,
    textAlign: 'center',
    marginBottom: 4,
  },
  milestoneStatus: {
    ...theme.typography.labelCaps,
    fontSize: 8,
    color: '#94a3b8',
  },
});

export default Statistics;
