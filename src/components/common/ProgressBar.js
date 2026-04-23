import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const ProgressBar = ({ progress }) => {
  // progress is a value between 0 and 1
  const percentage = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { width: `${percentage}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  track: {
    height: '100%',
    backgroundColor: theme.colors.progress,
    borderRadius: theme.radius.full,
  },
});

export default ProgressBar;
