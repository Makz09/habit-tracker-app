import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Shield, CircleHelp, ExternalLink, Mail, FileText } from 'lucide-react-native';
import { theme } from '../theme';
import Constants from 'expo-constants';

import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { requestPermissions } from '../utils/notifications';

const SettingsDetail = ({ route, navigation }) => {
  const { type } = route.params;
  const { deleteAccount, user } = useAuth();
  const { habits } = useHabits();

  const [notifications, setNotifications] = React.useState({
    dailyReminders: false,
    weeklyReports: false,
    communityUpdates: false,
  });

  React.useEffect(() => {
    if (type === 'notifications') {
      loadSettings();
    }
  }, [type]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@notification_settings');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Failed to load settings', e);
    }
  };

  const handleToggle = async (key, value) => {
    const newSettings = { ...notifications, [key]: value };
    setNotifications(newSettings);
    await AsyncStorage.setItem('@notification_settings', JSON.stringify(newSettings));
    
    if (key === 'dailyReminders') {
      if (value) {
        const hasPerms = await requestPermissions();
        if (hasPerms) {
          await Notifications.scheduleNotificationAsync({
            identifier: 'daily-reminder',
            content: {
              title: "Daily Habit Check-in 🌟",
              body: "Take a moment to log your habits today and keep your streak alive!",
              sound: true,
            },
            trigger: {
              hour: 8, // 8 AM
              minute: 0,
              repeats: true,
            },
          });
        } else {
          Alert.alert("Permission Required", "Please enable notifications in your device settings.");
          const reverted = { ...notifications, [key]: false };
          setNotifications(reverted);
          await AsyncStorage.setItem('@notification_settings', JSON.stringify(reverted));
        }
      } else {
        try { await Notifications.cancelScheduledNotificationAsync('daily-reminder'); } catch(e) {}
      }
    }

    if (key === 'weeklyReports') {
      if (value) {
        const hasPerms = await requestPermissions();
        if (hasPerms) {
          await Notifications.scheduleNotificationAsync({
            identifier: 'weekly-report',
            content: {
              title: "Weekly Summary Ready 📊",
              body: "Check out how well you did this week!",
              sound: true,
            },
            trigger: {
              weekday: 1, // Sunday
              hour: 10,
              minute: 0,
              repeats: true,
            },
          });
        } else {
          Alert.alert("Permission Required", "Please enable notifications in your device settings.");
          const reverted = { ...notifications, [key]: false };
          setNotifications(reverted);
          await AsyncStorage.setItem('@notification_settings', JSON.stringify(reverted));
        }
      } else {
        try { await Notifications.cancelScheduledNotificationAsync('weekly-report'); } catch(e) {}
      }
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'notifications':
        return (
          <View>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Daily Reminders</Text>
                  <Text style={styles.settingSubtitle}>Get reminded to complete your habits daily.</Text>
                </View>
                <Switch 
                  value={notifications.dailyReminders} 
                  onValueChange={(v) => handleToggle('dailyReminders', v)}
                  trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Weekly Reports</Text>
                  <Text style={styles.settingSubtitle}>Receive a summary of your weekly progress.</Text>
                </View>
                <Switch 
                  value={notifications.weeklyReports} 
                  onValueChange={(v) => handleToggle('weeklyReports', v)}
                  trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>COMMUNITY</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Community Updates</Text>
                  <Text style={styles.settingSubtitle}>Stay updated on popular habits and challenges.</Text>
                </View>
                <Switch 
                  value={notifications.communityUpdates} 
                  onValueChange={(v) => handleToggle('communityUpdates', v)}
                  trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
                />
              </View>
            </View>
          </View>
        );

      case 'privacy':
        return (
          <View>
            <Text style={styles.sectionTitle}>SECURITY</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.actionItem}>
                <Shield size={20} color="#64748b" />
                <Text style={styles.actionText}>Biometric Authentication</Text>
                <View style={styles.badge}>
                   <Text style={styles.badgeText}>COMING SOON</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => Linking.openURL('https://www.google.com/search?q=privacy+policy+sample')}
              >
                <FileText size={20} color="#64748b" />
                <Text style={styles.actionText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>DATA</Text>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={async () => {
                  try {
                    const data = JSON.stringify({ user, habits }, null, 2);
                    const fileUri = FileSystem.documentDirectory + 'habit_tracker_export.json';
                    await FileSystem.writeAsStringAsync(fileUri, data);
                    await Sharing.shareAsync(fileUri);
                  } catch (e) {
                    Alert.alert('Error', 'Failed to export data');
                  }
                }}
              >
                <ExternalLink size={20} color="#64748b" />
                <Text style={styles.actionText}>Export My Data</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => {
                  Alert.alert(
                    "Delete Account",
                    "This action is irreversible. All your progress will be lost. Are you sure?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Delete", 
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await deleteAccount();
                          } catch (e) {
                            Alert.alert('Error', 'Session expired. Please re-login to delete your account.');
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={[styles.actionText, { color: '#ef4444', marginLeft: 32 }]}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        );


      case 'support':
        return (
          <View>
            <Text style={styles.sectionTitle}>GET HELP</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('mailto:charlesdonor.02@gmail.com')}>
                <Mail size={20} color="#64748b" />
                <Text style={styles.actionText}>Contact Support</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.actionItem}>
                <CircleHelp size={20} color="#64748b" />
                <Text style={styles.actionText}>FAQs</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>ABOUT</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App Version</Text>
                <Text style={styles.infoValue}>{Constants.expoConfig?.version || '1.0.0'}</Text>

              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Developer</Text>
                <Text style={styles.infoValue}>https://github.com/Makz09</Text>
              </View>
            </View>
          </View>
        );

      default:
        return <Text>Invalid settings type</Text>;
    }
  };

  const getHeaderTitle = () => {
    if (type === 'notifications') return 'Notifications';
    if (type === 'privacy') return 'Privacy & Security';
    if (type === 'support') return 'Help & Support';
    return 'Settings';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {renderContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    fontSize: 18,
    color: '#0f172a',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...theme.typography.bodyMd,
    fontSize: 16,
    color: '#334155',
    marginBottom: 2,
  },
  settingSubtitle: {
    ...theme.typography.bodySm,
    color: '#94a3b8',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionText: {
    ...theme.typography.bodyMd,
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  infoLabel: {
    ...theme.typography.bodyMd,
    color: '#94a3b8',
  },
  infoValue: {
    ...theme.typography.bodyMd,
    color: '#334155',
    fontWeight: '600',
  },
});

export default SettingsDetail;
