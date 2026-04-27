import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react-native';
import { theme } from '../theme';

import { useAuth } from '../context/AuthContext';

import Dashboard from '../screens/Dashboard';
import HabitLibrary from '../screens/HabitLibrary';
import History from '../screens/History';
import Statistics from '../screens/Statistics';
import Options from '../screens/Options';
import AccountDetails from '../screens/AccountDetails';
import HabitDetail from '../screens/HabitDetail';
import Login from '../screens/Login';
import Register from '../screens/Register';
import SettingsDetail from '../screens/SettingsDetail';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={Dashboard} />
      <Stack.Screen name="HabitDetail" component={HabitDetail} />
    </Stack.Navigator>
  );
};

const OptionsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OptionsMain" component={Options} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} />
      <Stack.Screen name="SettingsDetail" component={SettingsDetail} />
    </Stack.Navigator>

  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          height: 80,
          paddingBottom: 15,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          ...theme.typography.labelBold,
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen
        name="Library"
        component={HabitLibrary}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.activeIconContainer, focused && styles.activeIconBg]}>
              <BookOpen color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.activeIconContainer, focused && styles.activeIconBg]}>
              <Calendar color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.activeIconContainer, focused && styles.activeIconBg]}>
              <Home color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={Statistics}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.activeIconContainer, focused && styles.activeIconBg]}>
              <BarChart3 color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Options"
        component={OptionsStack}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.activeIconContainer, focused && styles.activeIconBg]}>
              <Settings color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return user ? <MainTabs /> : <AuthStack />;
};

const styles = {
  activeIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  activeIconBg: {
    backgroundColor: '#f0fdf4',
  }
};

export default AppNavigator;
