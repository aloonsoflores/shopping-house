import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows } from '../styles/designSystem';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, X } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ type, message, visible, onDismiss, duration = 3000 }: ToastProps) {
  const { colors } = useContext(ThemeContext);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'info':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={colors.onPrimary} />;
      case 'error':
        return <AlertCircle size={20} color={colors.onError} />;
      case 'info':
        return <AlertCircle size={20} color={colors.onPrimary} />;
      default:
        return null;
    }
  };

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: spacing.huge,
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 9999,
    },
    toast: {
      backgroundColor: getBackgroundColor(),
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.xl,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    message: {
      ...typography.bodyMedium,
      color: type === 'error' ? colors.onError : colors.onPrimary,
      flex: 1,
    },
    closeButton: {
      padding: spacing.xs,
    },
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.toast}>
        <View style={styles.content}>
          {getIcon()}
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <X size={20} color={type === 'error' ? colors.onError : colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
