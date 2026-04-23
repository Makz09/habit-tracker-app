import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Calendar, MoreVertical } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const History = () => {
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.placeholder}>
          <Calendar size={64} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.2 }} />
          <Text style={styles.placeholderText}>Your habit history will appear here.</Text>
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
    flexGrow: 1,
    padding: theme.spacing.margin,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  placeholderText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default History;
