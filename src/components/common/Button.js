import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';

const Button = ({ title, onPress, type = 'primary', style, textStyle }) => {
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.baseButton, getButtonStyle()]}
      >
        <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    ...theme.typography.bodyMd,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.secondary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default Button;
