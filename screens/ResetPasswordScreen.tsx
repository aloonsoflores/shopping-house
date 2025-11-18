import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../contexts/ThemeContext';
import { supabase } from '../supabase';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { Lock, CircleCheck, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function ResetPasswordScreen({ navigation }: any) {
  const { colors } = useContext(ThemeContext);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password.trim() || !confirm.trim()) {
      setStatus('error');
      setMessage('Por favor completa todos los campos');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Error al actualizar la contraseña');
    } else {
      setStatus('success');
      setMessage('Tu contraseña ha sido restablecida correctamente.');
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, justifyContent: 'center' },
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge },
    header: { marginBottom: spacing.xxxl },
    /* title: { ...typography.h1, color: colors.onBackground, marginBottom: spacing.sm, textAlign: 'center' }, */
    subtitle: { ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center' },
    inputGroup: { marginBottom: spacing.lg },
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
    inputIcon: { marginRight: spacing.sm },
    input: { flex: 1, height: touchTargetSize.comfortable, ...typography.body, color: colors.onSurface },
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
    footer: { alignItems: 'center', marginTop: spacing.xl },
    linkText: { ...typography.bodyMedium, color: colors.primary },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              {/* <Text style={styles.title}>Restablecer contraseña</Text> */}
              <Text style={styles.subtitle}>Introduce tu nueva contraseña</Text>
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
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            <Button
              title="Actualizar contraseña"
              onPress={handleResetPassword}
              variant="primary"
              fullWidth
              loading={loading}
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
