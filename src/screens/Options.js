import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, User, Bell, Shield, CircleHelp, ChevronRight, Settings, Target, Star, Medal, Zap, Award, Crown, Flame, Trophy, Rocket, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import Avatar from '../components/common/Avatar';

const Options = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { habits } = useHabits();
  const [refreshing, setRefreshing] = React.useState(false);

  let totalCompletions = 0;
  let maxStreak = 0;
  habits.forEach(habit => {
    totalCompletions += habit.completedDays?.length || 0;
    if ((habit.streak || 0) > maxStreak) maxStreak = habit.streak;
  });

  const milestones = [
    { id: 1, title: 'Habit Starter', target: 1, type: 'completions', icon: Rocket, color: '#fca5a5' },
    { id: 2, title: 'Perfect Week', target: 7, type: 'streak', icon: Star, color: '#22c55e' },
    { id: 3, title: 'Double Digits', target: 10, type: 'completions', icon: Medal, color: '#60a5fa' },
    { id: 4, title: 'Momentum', target: 14, type: 'streak', icon: Zap, color: '#eab308' },
    { id: 5, title: '30-Day Warrior', target: 30, type: 'streak', icon: Award, color: '#f97316' },
    { id: 6, title: user?.gender?.toLowerCase() === 'female' ? 'Consistency Queen' : 'Consistency King', target: 50, type: 'completions', icon: Crown, color: '#a855f7' },
    { id: 7, title: 'On Fire', target: 60, type: 'streak', icon: Flame, color: '#ef4444' },
    { id: 8, title: 'Century Club', target: 100, type: 'completions', icon: CheckCircle2, color: '#3b82f6' },
    { id: 9, title: 'Half-Year Hero', target: 180, type: 'streak', icon: Shield, color: '#14b8a6' },
    { id: 10, title: 'Grandmaster', target: 500, type: 'completions', icon: Trophy, color: '#eab308' },
  ];

  const unlockedMilestones = milestones.filter(m => {
    const currentValue = m.type === 'streak' ? maxStreak : totalCompletions;
    return currentValue >= m.target;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);


  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout failed: ", error);
            }
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  const OptionItem = ({ icon: Icon, title, onPress, danger }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionItemLeft}>
        <Icon size={24} color={danger ? '#ef4444' : '#64748b'} />
        <Text style={[styles.optionTitle, danger && styles.dangerText]}>{title}</Text>
      </View>
      {!danger && <ChevronRight size={20} color="#cbd5e1" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Settings size={24} color="#0f172a" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Options</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >

        <View style={styles.profileSection}>
          <Avatar uri={user?.photoURL} size={80} style={{ marginBottom: 16 }} />
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {unlockedMilestones.length > 0 && (
            <View style={styles.badgesContainer}>
              {unlockedMilestones.map(m => {
                const IconComp = m.icon;
                return (
                  <View key={m.id} style={[styles.badgeIcon, { backgroundColor: m.color }]}>
                    <IconComp size={16} color="#ffffff" />
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.optionsList}>
          <OptionItem icon={User} title="Account Details" onPress={() => navigation.navigate('AccountDetails')} />
          <OptionItem icon={Bell} title="Notifications" onPress={() => navigation.navigate('SettingsDetail', { type: 'notifications' })} />
          <OptionItem icon={Shield} title="Privacy & Security" onPress={() => navigation.navigate('SettingsDetail', { type: 'privacy' })} />
        </View>

        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.optionsList}>
          <OptionItem icon={CircleHelp} title="Help & Support" onPress={() => navigation.navigate('SettingsDetail', { type: 'support' })} />
          <OptionItem icon={LogOut} title="Sign Out" onPress={handleLogout} danger />
        </View>

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
  headerIcon: {
  },
  container: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userName: {
    ...theme.typography.headlineMd,
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    ...theme.typography.bodyMd,
    color: '#64748b',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 8,
  },
  optionsList: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    ...theme.typography.bodyMd,
    fontSize: 16,
    color: '#334155',
    marginLeft: 16,
  },
  dangerText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default Options;
