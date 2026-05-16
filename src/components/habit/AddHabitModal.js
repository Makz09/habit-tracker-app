import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { X, Plus, Check, Bell } from 'lucide-react-native';
import { theme } from '../../theme';
import { useHabits } from '../../context/HabitContext';
import Button from '../common/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleHabitReminder, cancelHabitReminder } from '../../utils/notifications';

const AddHabitModal = ({ visible, onClose, habit = null }) => {
  const { addHabit, updateHabit, customCategories, defaultCategories, addCategory } = useHabits();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('Daily');
  const [target, setTarget] = useState('');
  const [targetUnit, setTargetUnit] = useState('mins');
  
  // Reminder state
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Custom category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const categories = [...defaultCategories, ...customCategories];
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  const units = ['mins', 'hours', 'times', 'cups', 'km', 'steps'];

  React.useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setCategory(habit.category || 'Health');
      setFrequency(habit.frequency || 'Daily');
      setTarget(habit.target?.toString() || '');
      setTargetUnit(habit.targetUnit || 'mins');
      setReminderEnabled(habit.reminderEnabled || false);
      if (habit.reminderTime) {
        const [h, m] = habit.reminderTime.split(':');
        const d = new Date();
        d.setHours(parseInt(h), parseInt(m));
        setReminderTime(d);
      }
    } else {
      setName('');
      setCategory('Health');
      setFrequency('Daily');
      setTarget('');
      setTargetUnit('mins');
      setReminderEnabled(false);
      setReminderTime(new Date());
    }
  }, [habit, visible]);

  const handleCreateCategory = async () => {
    if (newCatName.trim()) {
      await addCategory(newCatName.trim());
      setCategory(newCatName.trim());
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowTimePicker(Platform.OS === 'ios');
    setReminderTime(currentDate);
  };

  const handleSubmit = async () => {
    if (name.trim()) {
      const timeStr = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;
      const habitData = {
        name: name.trim(),
        category,
        frequency,
        target: target ? parseInt(target) : null,
        targetUnit: target ? targetUnit : null,
        reminderEnabled,
        reminderTime: reminderEnabled ? timeStr : null,
      };

      let finalHabitId = habit?.id;
      if (habit) {
        await updateHabit(habit.id, habitData);
      } else {
        finalHabitId = await addHabit(habitData);
      }

      // Handle Notifications
      if (reminderEnabled && finalHabitId) {
        await scheduleHabitReminder(
          finalHabitId, 
          name.trim(), 
          reminderTime.getHours(), 
          reminderTime.getMinutes()
        );
      } else if (habit) {
        await cancelHabitReminder(habit.id);
      }
      
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <View style={styles.header}>
                <Text style={styles.title}>{habit ? 'Edit Habit' : 'New Habit'}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X color={theme.colors.onSurfaceVariant} size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.form}>
                  <Text style={styles.label}>HABIT NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Morning Run"
                    placeholderTextColor={theme.colors.outline}
                    value={name}
                    onChangeText={setName}
                    autoFocus={!habit}
                  />

                  <Text style={styles.label}>CATEGORY</Text>
                  <View style={styles.chipContainer}>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.chip,
                          category === cat && styles.chipActive
                        ]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text style={[
                          styles.chipText,
                          category === cat && styles.chipTextActive
                        ]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                    
                    {isAddingCategory ? (
                      <View style={styles.addCatRow}>
                        <TextInput
                          style={styles.addCatInput}
                          placeholder="Name..."
                          value={newCatName}
                          onChangeText={setNewCatName}
                          autoFocus
                        />
                        <TouchableOpacity style={styles.confirmCatBtn} onPress={handleCreateCategory}>
                          <Check size={18} color="#ffffff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelCatBtn} onPress={() => setIsAddingCategory(false)}>
                          <X size={18} color={theme.colors.error} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.chip, styles.plusChip]}
                        onPress={() => setIsAddingCategory(true)}
                      >
                        <Plus size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>FREQUENCY</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                        {frequencies.map(freq => (
                          <TouchableOpacity
                            key={freq}
                            style={[
                              styles.chip,
                              frequency === freq && styles.chipActive,
                              { marginRight: 8 }
                            ]}
                            onPress={() => setFrequency(freq)}
                          >
                            <Text style={[
                              styles.chipText,
                              frequency === freq && styles.chipTextActive
                            ]}>{freq}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  <Text style={styles.label}>TARGET (OPTIONAL)</Text>
                  <View style={styles.targetRow}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 12 }]}
                      placeholder="e.g. 30"
                      keyboardType="numeric"
                      value={target}
                      onChangeText={setTarget}
                    />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitContainer}>
                      {units.map(unit => (
                        <TouchableOpacity
                          key={unit}
                          style={[
                            styles.chip,
                            targetUnit === unit && styles.chipActive,
                            { marginRight: 8 }
                          ]}
                          onPress={() => setTargetUnit(unit)}
                        >
                          <Text style={[
                            styles.chipText,
                            targetUnit === unit && styles.chipTextActive
                          ]}>{unit}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <Text style={styles.label}>REMINDER</Text>
                  <View style={styles.reminderCard}>
                    <View style={styles.reminderRow}>
                      <View style={styles.reminderHeader}>
                        <Bell size={20} color={reminderEnabled ? theme.colors.primary : '#94a3b8'} />
                        <Text style={styles.reminderTitle}>Daily Reminder</Text>
                      </View>
                      <Switch
                        value={reminderEnabled}
                        onValueChange={setReminderEnabled}
                        trackColor={{ false: '#cbd5e1', true: theme.colors.primary }}
                      />
                    </View>
                    
                    {reminderEnabled && (
                      <TouchableOpacity 
                        style={styles.timeSelector} 
                        onPress={() => setShowTimePicker(true)}
                      >
                        <Text style={styles.timeLabel}>Reminder Time</Text>
                        <Text style={styles.timeValue}>
                          {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {showTimePicker && (
                      <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onTimeChange}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.footer}>
                  <Button 
                    title={habit ? "Save Changes" : "Create Habit"} 
                    onPress={handleSubmit}
                    disabled={!name.trim() || isAddingCategory}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius['2xl'],
    borderTopRightRadius: theme.radius['2xl'],
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.headlineLg,
    color: theme.colors.onSurface,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.labelBold,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.typography.bodyMd,
    color: theme.colors.onSurface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  plusChip: {
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  chipActive: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitContainer: {
    flex: 1,
  },
  reminderCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderTitle: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurface,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  timeLabel: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurfaceVariant,
  },
  timeValue: {
    ...theme.typography.labelBold,
    color: theme.colors.primary,
    fontSize: 16,
  },
  addCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addCatInput: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurface,
    minWidth: 80,
    padding: 0,
  },
  confirmCatBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 4,
  },
  cancelCatBtn: {
    padding: 4,
  },
  footer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});

export default AddHabitModal;
