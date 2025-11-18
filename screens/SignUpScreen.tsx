import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Errores por campo
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const passwordRequirements = [
    { label: 'Al menos 8 caracteres', met: password.length >= 8 },
    { label: 'Contraseñas coinciden', met: password === confirmPassword && password.length > 0 },
  ];

  const handleSignUp = async () => {
    setError('');
    setFieldErrors({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    let hasError = false;
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Ingresa tu nombre completo';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Ingresa un correo electrónico';
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = 'Ingresa una contraseña';
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const { data, error: signUpError } = await signUp(email, password, fullName);
    setIsLoading(false);

    if (!signUpError) {
      if (!data.session) {
        Alert.alert(
          'Verifica tu correo',
          'Te hemos enviado un enlace de confirmación. Revisa tu bandeja de entrada antes de iniciar sesión.'
        );
        navigation.replace('SignIn');
      } else {
        navigation.replace('HouseSetup');
      }
    } else {
      setError(signUpError.message || 'Error al crear la cuenta');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    scrollContent: {
      flexGrow: 1
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xxl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    header: {
      marginBottom: spacing.xl
    },
    /* title: {
      ...typography.h1,
      color: colors.onBackground,
      marginBottom: spacing.sm,
      textAlign: 'center',
    }, */
    subtitle: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
    },
    form: {
      marginBottom: spacing.lg
    },
    inputGroup: {
      marginBottom: spacing.lg
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
      borderColor: colors.error
    },
    inputIcon: {
      marginRight: spacing.sm
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
    fieldErrorText: {
      ...typography.caption,
      color: colors.error,
      marginTop: 4,
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
      color: colors.success
    },
    buttonContainer: {
      marginBottom: spacing.lg
    },
    footer: {
      alignItems: 'center'
    },
    footerText: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      marginBottom: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              {/* <Text style={styles.title}>Crear cuenta</Text> */}
              <Text style={styles.subtitle}>Únete para gestionar tus listas de compra</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={colors.onErrorContainer} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              {/* Nombre completo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre completo</Text>
                <View
                  style={[
                    styles.inputContainer,
                    fieldErrors.fullName && styles.inputContainerError,
                  ]}
                >
                  <UserIcon size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Tu nombre"
                    placeholderTextColor={colors.onSurfaceVariant}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.fullName ? (
                  <Text style={styles.fieldErrorText}>{fieldErrors.fullName}</Text>
                ) : null}
              </View>

              {/* Correo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View
                  style={[
                    styles.inputContainer,
                    fieldErrors.email && styles.inputContainerError,
                  ]}
                >
                  <Mail size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="tu@email.com"
                    placeholderTextColor={colors.onSurfaceVariant}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.email ? (
                  <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
                ) : null}
              </View>

              {/* Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View
                  style={[
                    styles.inputContainer,
                    fieldErrors.password && styles.inputContainerError,
                  ]}
                >
                  <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={colors.onSurfaceVariant}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.password ? (
                  <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
                ) : null}
              </View>

              {/* Confirmar contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <View
                  style={[
                    styles.inputContainer,
                    fieldErrors.confirmPassword && styles.inputContainerError,
                  ]}
                >
                  <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={colors.onSurfaceVariant}
                    returnKeyType="done"
                  />
                </View>
                {fieldErrors.confirmPassword ? (
                  <Text style={styles.fieldErrorText}>{fieldErrors.confirmPassword}</Text>
                ) : null}
              </View>
            </View>

            {/* Requisitos de contraseña */}
            {password.length > 0 && (
              <View style={styles.requirementsContainer}>
                {passwordRequirements.map((req, index) => (
                  <View key={index} style={styles.requirementItem}>
                    {req.met ? (
                      <CheckCircle size={16} color={colors.success} />
                    ) : (
                      <AlertCircle size={16} color={colors.onSurfaceVariant} />
                    )}
                    <Text
                      style={[
                        styles.requirementText,
                        req.met && styles.requirementTextMet,
                      ]}
                    >
                      {req.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Botón de crear cuenta */}
            <View style={styles.buttonContainer}>
              <Button
                title="Crear cuenta"
                onPress={handleSignUp}
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={
                  !email.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim() ||
                  !fullName.trim()
                }
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
    </SafeAreaView>
  );
}
