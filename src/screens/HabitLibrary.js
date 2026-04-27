import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Plus, BookOpen, Droplets, Wind, PencilLine, Flame, MoreVertical, Layout, Heart, Brain, Users, Sparkles, Activity } from 'lucide-react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import AddHabitModal from '../components/habit/AddHabitModal';
import Avatar from '../components/common/Avatar';

const HabitLibrary = () => {
  const { user, logout } = useAuth();
  const { communityHabits, communityCategories, addCommunityHabit } = useHabits();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Real-time sync handles the data, but we provide a tactile refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleAddCommunityHabit = (habit) => {
    Alert.alert(
      "Add Habit",
      `Do you want to add "${habit.name}" to your habits?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Add", 
          onPress: async () => {
            await addCommunityHabit(habit);
            Alert.alert("Success", "Habit added to your list!");
          } 
        }
      ]
    );
  };

  // Icon mapping based on category name
  const getCategoryIcon = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes('health')) return Heart;
    if (name.includes('fitness')) return Activity;
    if (name.includes('mind') || name.includes('mental')) return Brain;
    if (name.includes('social')) return Users;
    if (name.includes('work') || name.includes('product')) return Layout;
    if (name.includes('read')) return BookOpen;
    if (name.includes('water')) return Droplets;
    return Sparkles;
  };

  // Dynamic styles for categories
  const getCategoryStyle = (catName) => {
    const name = catName?.toLowerCase() || '';
    if (name.includes('health') || name.includes('medical')) return { bg: '#fee2e2', color: '#ef4444' };
    if (name.includes('fitness') || name.includes('exercise') || name.includes('takbo')) return { bg: '#ffedd5', color: '#f97316' };
    if (name.includes('mind') || name.includes('mental')) return { bg: '#ede9fe', color: '#8b5cf6' };
    if (name.includes('social') || name.includes('friend')) return { bg: '#dbeafe', color: '#3b82f6' };
    if (name.includes('work') || name.includes('product') || name.includes('side line')) return { bg: '#e0e7ff', color: '#4f46e5' };
    if (name.includes('read') || name.includes('study')) return { bg: '#fef3c7', color: '#d97706' };
    if (name.includes('water') || name.includes('drink')) return { bg: '#e0f2fe', color: '#0ea5e9' };
    
    const colors = [
      { bg: '#fce7f3', color: '#ec4899' },
      { bg: '#dcfce7', color: '#22c55e' },
      { bg: '#f3e8ff', color: '#a855f7' },
      { bg: '#ccfbf1', color: '#14b8a6' },
    ];
    return colors[name.length % colors.length];
  };

  const displayedCategories = communityCategories.length > 0 
    ? communityCategories.slice(0, 5) 
    : ['Mindfulness', 'Fitness', 'Productivity', 'Health', 'Social'];

  const filteredRecommendations = communityHabits.length > 0
    ? communityHabits.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [
        { id: 'rec1', name: 'Read for 20 mins', category: 'Productivity', activeCount: '4.2K', color: '#f97316', bg: '#fff1e6' },
        { id: 'rec2', name: 'Drink 2L Water', category: 'Health', activeCount: '8.9K', color: '#0ea5e9', bg: '#e0f2fe' },
        { id: 'rec3', name: 'Daily Meditation', category: 'Mindfulness', activeCount: '12.4K', color: '#22c55e', bg: '#dcfce7' },
        { id: 'rec4', name: 'Morning Yoga', category: 'Fitness', activeCount: '3.1K', color: '#ef4444', bg: '#fee2e2' },
        { id: 'rec5', name: 'Journaling', category: 'Mindfulness', activeCount: '5.5K', color: '#8b5cf6', bg: '#ede9fe' },
      ].filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const displayedRecommendations = showAllRecs 
    ? filteredRecommendations 
    : filteredRecommendations.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <BookOpen size={24} color="#0f172a" style={styles.headerIcon} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.outline} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Find a habit"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.outline}
          />
        </View>

        {/* Popular Categories */}
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <Text style={styles.sectionSubtitle}>Explore by focus area</Text>

        {/* Featured Card */}
        {displayedCategories.length > 0 && (() => {
          const catName = displayedCategories[0];
          const IconComp = getCategoryIcon(catName);
          const catStyle = getCategoryStyle(catName);
          
          return (
            <TouchableOpacity style={[styles.featuredCard, { backgroundColor: catStyle.bg }]}>
              <View style={styles.featuredInner}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
                <View style={styles.featuredRow}>
                  <Text style={[styles.featuredTitleDark, { color: catStyle.color }]}>{catName}</Text>
                  <IconComp size={48} color={catStyle.color} style={{ opacity: 0.8 }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* Categories Grid */}
        <View style={styles.grid}>
          {displayedCategories.slice(1).map((cat, index) => {
            const IconComp = getCategoryIcon(cat);
            const catStyle = getCategoryStyle(cat);
            
            return (
              <TouchableOpacity key={`${cat}-${index}`} style={[styles.gridCard, { backgroundColor: catStyle.bg }]}>
                <View style={styles.gridInner}>
                  <IconComp size={32} color={catStyle.color} style={{ opacity: 0.8 }} />
                  <Text style={[styles.gridTitleDark, { color: catStyle.color }]} numberOfLines={2}>{cat}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity onPress={() => setShowAllRecs(!showAllRecs)}>
            <Text style={styles.seeAllText}>{showAllRecs ? 'SEE LESS' : 'SEE ALL'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recList}>
          {displayedRecommendations.map(rec => {
            const IconComp = getCategoryIcon(rec.category || '');
            return (
              <View key={rec.id} style={styles.recCard}>
                <View style={[styles.recIconBox, { backgroundColor: rec.bg || '#f1f5f9' }]}>
                  <IconComp size={24} color={rec.color || theme.colors.primary} />
                </View>
                <View style={styles.recContent}>
                  <Text style={styles.recName}>{rec.name}</Text>
                  <View style={styles.activeRow}>
                    <Flame size={12} color="#f97316" />
                    <Text style={styles.activeText}>{rec.activeCount || 'NEW'} ACTIVE</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.addBtn}
                  onPress={() => handleAddCommunityHabit(rec)}
                >
                  <Plus size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Custom Habit Button */}
        <TouchableOpacity 
          style={styles.customBtn}
          onPress={() => setModalVisible(true)}
        >
          <PencilLine size={20} color="#ffffff" />
          <Text style={styles.customBtnText}>Create Custom Habit</Text>
        </TouchableOpacity>

      </ScrollView>

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
    backgroundColor: '#f8fafc',
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
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 32,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.bodyMd,
    color: theme.colors.onSurface,
  },
  sectionTitle: {
    ...theme.typography.headlineMd,
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...theme.typography.bodyMd,
    color: '#64748b',
    marginBottom: 20,
  },
  featuredCard: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  featuredInner: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  featuredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredTitleDark: {
    ...theme.typography.headlineLg,
    fontSize: 28,
    flex: 1,
    marginRight: 16,
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  popularBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  gridCard: {
    width: '48%',
    height: 140,
    marginBottom: 16,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  gridInner: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gridTitleDark: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    ...theme.typography.labelBold,
    color: '#2563eb',
    fontSize: 12,
  },
  recList: {
    gap: 12,
    marginBottom: 32,
  },
  recCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 1,
  },
  recIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recContent: {
    flex: 1,
    marginLeft: 16,
  },
  recName: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 4,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeText: {
    ...theme.typography.labelBold,
    color: '#f97316',
    fontSize: 10,
  },
  addBtn: {
    backgroundColor: '#22c55e',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtn: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  customBtnText: {
    ...theme.typography.labelBold,
    color: '#ffffff',
    fontSize: 16,
  },
});

export default HabitLibrary;

