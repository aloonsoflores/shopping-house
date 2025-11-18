import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { Mail, Lock, User as UserIcon, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { label: 'Al menos 8 caracteres', met: password.length >= 8 },
    { label: 'Contraseñas coinciden', met: password === confirmPassword && password.length > 0 },
  ];

  const handleSignUp = async () => {
    setError('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !fullName.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    setIsLoading(false);

    if (!signUpError) {
      navigation.replace('HouseSetup');
    } else {
      setError(signUpError.message || 'Error al crear la cuenta');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xxl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    header: {
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h1,
      color: colors.onBackground,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
    },
    form: {
      marginBottom: spacing.lg,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      ...typography.captionMedium,
      color: colors.onSurfaceVariant,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.outline,
      ...shadows.sm,
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    inputIcon: {
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.errorContainer,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    errorText: {
      ...typography.caption,
      color: colors.onErrorContainer,
      flex: 1,
    },
    requirementsContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      ...shadows.sm,
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    requirementText: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
    },
    requirementTextMet: {
      color: colors.success,
    },
    buttonContainer: {
      marginBottom: spacing.lg,
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      marginBottom: spacing.sm,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Únete para gestionar tus listas de compra
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.onErrorContainer} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <UserIcon size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setError('');
                  }}
                  placeholder="Tu nombre"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <Mail size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError('');
                  }}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
              </View>
            </View>
          </View>

          {password.length > 0 && (
            <View style={styles.requirementsContainer}>
              {passwordRequirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  {req.met ? (
                    <CheckCircle size={16} color={colors.success} />
                  ) : (
                    <AlertCircle size={16} color={colors.onSurfaceVariant} />
                  )}
                  <Text style={[styles.requirementText, req.met && styles.requirementTextMet]}>
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Crear cuenta"
              onPress={handleSignUp}
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || !fullName.trim()}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <Button
              title="Iniciar sesión"
              onPress={() => navigation.goBack()}
              variant="tertiary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
