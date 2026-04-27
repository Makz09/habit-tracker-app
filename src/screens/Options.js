import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, User, Bell, Shield, CircleHelp, ChevronRight, Settings } from 'lucide-react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Options = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

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
        <Text style={styles.headerTitle}>Options</Text>
        <Settings size={24} color="#0f172a" style={styles.headerIcon} />
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
