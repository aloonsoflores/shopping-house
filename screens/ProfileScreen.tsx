import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Image } from 'react-native';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { Picker } from "@react-native-picker/picker";
import { languageOptions } from '../utils/languages';

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);
  const [phone, setPhone] = useState('');

  // Guardamos snapshot del perfil cargado
  const [originalProfile, setOriginalProfile] = useState<any>(null);

  // Generar URL de avatar por defecto usando la API
  const getDefaultAvatar = (name: string) => {
    if (!name) return `https://avatar.iran.liara.run/public/boy?username=User`;
    const firstWord = name.split(' ')[0];
    return `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(firstWord)}`;
  };

  // Cargar datos del perfil
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        Alert.alert('Error', error.message);
      } else {
        const profile = {
          full_name: data?.full_name || '',
          language: data?.language || 'es',
          notifications: data?.notifications ?? true,
          phone: data?.phone || ''
        };
        setFullName(profile.full_name);
        setLanguage(profile.language);
        setNotifications(profile.notifications);
        setPhone(profile.phone);
        setOriginalProfile(profile);
      }
    };
    loadProfile();
  }, [user]);

  // Guardar datos del perfil
  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        language,
        notifications,
        phone
      });
    if (error) Alert.alert('Error', error.message);
    else {
      Alert.alert('Éxito', 'Perfil actualizado');
      // actualizar snapshot
      setOriginalProfile({ full_name: fullName, language, notifications, phone });
    }
  };

  // Eliminar cuenta
  const deleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;

    try {
      // Eliminar el perfil (esto también eliminará el usuario por el cascade)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Cerrar sesión
      await signOut();
      
      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar la cuenta');
    }
  };

  // Comprobar si hay cambios
  const hasChanges =
    originalProfile &&
    (fullName !== originalProfile.full_name ||
      language !== originalProfile.language ||
      notifications !== originalProfile.notifications ||
      phone !== originalProfile.phone);

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 20,
      backgroundColor: colors.surfaceVariant,
    },
    label: {
      color: colors.onBackground,
      fontWeight: '600',
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surface,
      color: colors.onSurface,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      color: colors.onPrimary,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    deleteButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#ef4444',
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 30,
      marginBottom: 20,
    },
    deleteButtonText: {
      color: '#ef4444',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return (
    <ScrollView style={styles.screen}>
      <Image
        source={{ uri: getDefaultAvatar(fullName) }}
        style={styles.avatar}
      />

      <Text style={styles.label}>Correo (no editable)</Text>
      <TextInput style={styles.input} value={user?.email || ''} editable={false} />

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Idioma</Text>
      <View style={{ borderWidth: 1, borderColor: colors.outline, borderRadius: 8 }}>
        <Picker
          selectedValue={language}
          onValueChange={(value) => setLanguage(value)}
          style={{ color: colors.onSurface }}
          dropdownIconColor={colors.onSurface}
        >
          {languageOptions
            .filter((lang) => ["es", "en"].includes(lang.code))
            .map((lang) => (
              <Picker.Item
                key={lang.code}
                label={`${lang.flag} ${lang.native || lang.name}`}
                value={lang.code}
              />
            ))}
        </Picker>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Notificaciones</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
          thumbColor={notifications ? colors.onPrimary : colors.onSurface}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={saveProfile}
        disabled={!hasChanges}
      >
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={deleteAccount}
      >
        <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
