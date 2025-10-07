import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing } from '../styles/designSystem';
import Button from './Button';
import LottieView from 'lottie-react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showAnimation?: boolean;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  showAnimation = true,
}: EmptyStateProps) {
  const { colors } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.huge,
    },
    animation: {
      width: 200,
      height: 200,
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h3,
      color: colors.onBackground,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    description: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
  });

  return (
    <View style={styles.container}>
      {showAnimation && (
        <LottieView
          source={require('../assets/lottie/Shopping List.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" />
      )}
    </View>
  );
}
