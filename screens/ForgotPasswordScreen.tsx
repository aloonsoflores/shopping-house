import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { Mail, CircleCheck, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { sendResetCode } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    setStatus('idle');
    setMessage('');

    if (!email.trim()) {
      setStatus('error');
      setMessage('Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    const { error } = await sendResetCode(email);
    setIsLoading(false);

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Error al enviar el código. Intenta nuevamente.');
    } else {
      setStatus('success');
      setMessage('Te hemos enviado un código de 6 dígitos a tu correo.');
      setTimeout(() => navigation.navigate('VerifyCode', { email }), 1200);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
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
      marginBottom: spacing.xl
    },
    /* title: {
      ...typography.h1,
      color: colors.onBackground,
      marginBottom: spacing.sm,
      textAlign: 'center'
    }, */
    subtitle: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      textAlign: 'center'
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
    inputIcon: {
      marginRight: spacing.sm
    },
    input: {
      flex: 1,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: status === 'success' ? colors.primaryContainer : colors.errorContainer,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    messageText: {
      ...typography.caption,
      color: status === 'success' ? colors.onPrimaryContainer : colors.onErrorContainer,
      flex: 1,
    },
    footer: {
      alignItems: 'center',
      marginTop: spacing.lg
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              {/* <Text style={styles.title}>Recuperar contraseña</Text> */}
              <Text style={styles.subtitle}>Introduce tu correo y te enviaremos un código para restablecerla</Text>
            </View>

            {status !== 'idle' && (
              <View style={styles.messageContainer}>
                {status === 'success' ? (
                  <CircleCheck size={20} color={colors.onPrimaryContainer} />
                ) : (
                  <AlertCircle size={20} color={colors.onErrorContainer} />
                )}
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="done"
                  onSubmitEditing={handleSendCode}
                />
              </View>
            </View>

            <Button
              title="Enviar enlace"
              onPress={handleSendCode}
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={!email.trim()}
            />

            <View style={styles.footer}>
              <Button
                title="Volver al inicio de sesión"
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
