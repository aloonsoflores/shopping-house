import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import LottieView from 'lottie-react-native';

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useContext(AuthContext);
  const { colors, theme } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (!error) navigation.replace('HouseSetup');
    else Alert.alert('Error', error.message);
  };

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 48,
      backgroundColor: colors.background,
    },
    lottie: {
      width: 256,
      height: 256,
      alignSelf: 'center',
      marginBottom: 24,
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
    linkText: {
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.screen}>
      <LottieView
        source={require('../assets/lottie/Shopping List.json')}
        autoPlay
        loop
        style={styles.lottie}
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
        placeholder="********"
        placeholderTextColor={colors.onSurfaceVariant}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Crear una cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
