import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Plus, BookOpen, Droplets, Wind, PencilLine, Flame, MoreVertical } from 'lucide-react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import AddHabitModal from '../components/habit/AddHabitModal';
import Avatar from '../components/common/Avatar';

const HabitLibrary = () => {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = [
    { 
      id: 'mindfulness', 
      name: 'Mindfulness', 
      isPopular: true, 
      image: 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/mindfulness_bg_1776956962762.png' 
    },
    { 
      id: 'fitness', 
      name: 'Fitness', 
      image: 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/fitness_bg_1776956986525.png' 
    },
    { 
      id: 'productivity', 
      name: 'Productivity', 
      image: 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/productivity_bg_1776957009963.png' 
    },
    { 
      id: 'health', 
      name: 'Health', 
      image: 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/health_bg_1776957030248.png' 
    },
    { 
      id: 'social', 
      name: 'Social', 
      image: 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/social_bg_1776957056265.png' 
    },
  ];

  const recommendations = [
    { id: 1, name: 'Read for 20 mins', active: '4.2K ACTIVE', icon: BookOpen, color: '#f97316', bg: '#fff1e6' },
    { id: 2, name: 'Drink 2L Water', active: '8.9K ACTIVE', icon: Droplets, color: '#0ea5e9', bg: '#e0f2fe' },
    { id: 3, name: 'Daily Meditation', active: '12.4K ACTIVE', icon: Wind, color: '#22c55e', bg: '#dcfce7' },
  ];

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

        {/* Featured Mindfulness Card */}
        <TouchableOpacity style={styles.featuredCard}>
          <ImageBackground 
            source={{ uri: categories[0].image }} 
            style={styles.featuredBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.overlay}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
              <Text style={styles.featuredTitle}>Mindfulness</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.slice(1).map(cat => (
            <TouchableOpacity key={cat.id} style={styles.gridCard}>
              <ImageBackground 
                source={{ uri: cat.image }} 
                style={styles.gridBg}
                imageStyle={{ borderRadius: 24 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.gridTitle}>{cat.name}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recList}>
          {recommendations.map(rec => (
            <View key={rec.id} style={styles.recCard}>
              <View style={[styles.recIconBox, { backgroundColor: rec.bg }]}>
                <rec.icon size={24} color={rec.color} />
              </View>
              <View style={styles.recContent}>
                <Text style={styles.recName}>{rec.name}</Text>
                <View style={styles.activeRow}>
                  <Flame size={12} color="#f97316" />
                  <Text style={styles.activeText}>{rec.active}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addBtn}>
                <Plus size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
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
  },
  featuredBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
  },
  popularBadge: {
    backgroundColor: 'rgba(21, 128, 61, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredTitle: {
    ...theme.typography.headlineLg,
    color: '#ffffff',
    fontSize: 28,
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
  },
  gridBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gridTitle: {
    ...theme.typography.headlineMd,
    color: '#ffffff',
    fontSize: 22,
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
