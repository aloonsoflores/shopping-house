import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

export default function SignUpScreen({ navigation }: any) {
  const { signUp } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Validaciones
    if (!fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const { error } = await signUp(email, password, fullName);
    if (!error) {
      Alert.alert('Cuenta creada', 'Revisa tu correo si se requiere confirmación.');
      navigation.goBack();
    } else {
      Alert.alert('Error', error.message);
    }
  };

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 48,
      backgroundColor: colors.background,
    },
    label: {
      color: colors.onBackground,
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      backgroundColor: colors.surface,
      color: colors.onSurface,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 16,
    },
    buttonText: {
      color: colors.onPrimary,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        placeholder="Juan Pérez"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="correo@example.com"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repite la contraseña"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
