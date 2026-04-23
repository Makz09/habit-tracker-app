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
  Alert
} from 'react-native';
import { X, Plus, Check } from 'lucide-react-native';
import { theme } from '../../theme';
import { useHabits } from '../../context/HabitContext';
import Button from '../common/Button';

const AddHabitModal = ({ visible, onClose }) => {
  const { addHabit, customCategories, defaultCategories, addCategory } = useHabits();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState('Daily');
  
  // Custom category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const categories = [...defaultCategories, ...customCategories];
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  const handleCreateCategory = async () => {
    if (newCatName.trim()) {
      await addCategory(newCatName.trim());
      setCategory(newCatName.trim());
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      addHabit({
        name: name.trim(),
        category,
        frequency,
      });
      setName('');
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
                <Text style={styles.title}>New Habit</Text>
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
                    autoFocus
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

                  <Text style={styles.label}>FREQUENCY</Text>
                  <View style={styles.chipContainer}>
                    {frequencies.map(freq => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.chip,
                          frequency === freq && styles.chipActive
                        ]}
                        onPress={() => setFrequency(freq)}
                      >
                        <Text style={[
                          styles.chipText,
                          frequency === freq && styles.chipTextActive
                        ]}>{freq}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.footer}>
                  <Button 
                    title="Create Habit" 
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
