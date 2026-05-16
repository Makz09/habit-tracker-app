import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export const scheduleHabitReminder = async (habitId, habitName, hour, minute) => {
  // First cancel any existing reminder for this habit
  await cancelHabitReminder(habitId);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time for your habit! 🚀",
      body: `Don't forget to complete: ${habitName}`,
      data: { habitId },
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      channelId: 'habit-reminders',
    },
  });

  return identifier;
};

export const cancelHabitReminder = async (habitId) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.habitId === habitId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};
