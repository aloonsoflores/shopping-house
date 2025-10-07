import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import LottieView from 'lottie-react-native';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { Mail, Lock, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await signIn(email, password);
    setIsLoading(false);

    if (!signInError) {
      navigation.replace('HouseSetup');
    } else {
      setError(signInError.message || 'Error al iniciar sesión');
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
      paddingTop: spacing.huge,
    },
    lottie: {
      width: 240,
      height: 240,
      alignSelf: 'center',
      marginBottom: spacing.xl,
    },
    header: {
      marginBottom: spacing.xxxl,
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
      marginBottom: spacing.xl,
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
    buttonContainer: {
      marginBottom: spacing.xl,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.outline,
    },
    dividerText: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
      paddingHorizontal: spacing.md,
    },
    footer: {
      alignItems: 'center',
      paddingBottom: spacing.xxxl,
    },
    footerText: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      marginBottom: spacing.sm,
    },
    linkButton: {
      paddingVertical: spacing.sm,
    },
    linkText: {
      ...typography.bodyMedium,
      color: colors.primary,
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
          <LottieView
            source={require('../assets/lottie/Shopping List.json')}
            autoPlay
            loop
            style={styles.lottie}
          />

          <View style={styles.header}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para gestionar tus listas de compra
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
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Iniciar sesión"
              onPress={handleSignIn}
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={!email.trim() || !password.trim()}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <Button
              title="Crear una cuenta"
              onPress={() => navigation.navigate('SignUp')}
              variant="tertiary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
