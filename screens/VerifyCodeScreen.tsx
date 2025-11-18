import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { Mail, CircleCheck, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function VerifyCodeScreen({ navigation, route }: any) {
  const { verifyResetCode } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      setStatus('error');
      setMessage('Por favor ingresa el código de verificación.');
      return;
    }

    setLoading(true);
    const { data, error } = await verifyResetCode(email, code);
    setLoading(false);

    if (error) {
      setStatus('error');
      setMessage(error.message || 'El código no es válido o expiró.');
    } else {
      setStatus('success');
      setMessage('Código verificado correctamente.');
      navigation.navigate('ResetPassword', { email });
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
    linkText: {
      ...typography.bodyMedium,
      color: colors.primary
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              {/* <Text style={styles.title}>Verificar código</Text> */}
              <Text style={styles.subtitle}>Ingresa el código que enviamos a tu correo electrónico.</Text>
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
              <Text style={styles.label}>Código</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholder="Ingresa el código de 6 dígitos"
                  placeholderTextColor={colors.onSurfaceVariant}
                  returnKeyType="done"
                  maxLength={6}
                  onSubmitEditing={handleVerify}
                />
              </View>
            </View>

            <Button
              title="Verificar código"
              onPress={handleVerify}
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!email.trim()}
            />

            <View style={styles.footer}>
              <Text style={styles.linkText} onPress={() => navigation.navigate('SignIn')}>
                Volver al inicio de sesión
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
