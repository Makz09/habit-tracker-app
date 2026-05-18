import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Flame } from 'lucide-react-native';
import { theme } from '../../theme';
import { getHabitDisplay } from '../../utils/helpers';

const HabitCard = ({ name, category, streak, completed, onToggle, onPress }) => {
  const display = getHabitDisplay(name, category);
  const IconComp = display.icon;

  return (
    <TouchableOpacity 
      style={[styles.card, completed && styles.cardCompleted]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: display.lightBg }]}>
        <IconComp size={24} color={display.bg} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.streakInfo}>
          <Flame size={12} color={completed ? '#f97316' : '#94a3b8'} />
          <Text style={[styles.streakText, completed && styles.streakTextActive]}>
            {streak} day streak
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.checkCircle, completed && styles.checkCircleCompleted]} 
        onPress={onToggle}
      >
        {completed && <Check size={20} color="#ffffff" />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 12,
    borderRadius: 20,
    marginBottom: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.typography.bodyLg,
    fontFamily: 'Lexend_600SemiBold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    ...theme.typography.labelBold,
    color: '#94a3b8',
  },
  streakTextActive: {
    color: '#f97316',
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

export default HabitCard;
