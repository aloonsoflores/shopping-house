import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, touchTargetSize, borderRadius, shadows } from '../styles/designSystem';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { colors } = useContext(ThemeContext);

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceVariant;

    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'tertiary':
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.onSurfaceVariant;

    switch (variant) {
      case 'primary':
        return colors.onPrimary;
      case 'secondary':
        return colors.onSecondary;
      case 'tertiary':
        return colors.primary;
      case 'danger':
        return colors.onError;
      default:
        return colors.onPrimary;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'tertiary') {
      return {
        borderWidth: 0,
      };
    }
    return {};
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return touchTargetSize.minimum;
      case 'medium':
        return touchTargetSize.comfortable;
      case 'large':
        return touchTargetSize.large;
      default:
        return touchTargetSize.comfortable;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      height: getHeight(),
      paddingHorizontal: getPaddingHorizontal(),
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...(variant !== 'tertiary' ? shadows.sm : {}),
      ...getBorderStyle(),
      ...(fullWidth ? { width: '100%' } : {}),
      opacity: disabled || loading ? 0.6 : 1,
    },
    text: {
      ...typography.button,
      color: getTextColor(),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
