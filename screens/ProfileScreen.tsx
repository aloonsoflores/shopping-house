import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { Picker } from "@react-native-picker/picker";
import { languageOptions } from '../utils/languages';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import { User, Mail, Phone, Globe, Bell, Camera, TrendingUp, ShoppingBag, Hop as HomeIcon } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);
  const [phone, setPhone] = useState('');
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    housesJoined: 0,
    itemsBought: 0,
  });

  const getDefaultAvatar = (name: string) => {
    if (!name) return `https://avatar.iran.liara.run/public/boy?username=User`;
    const firstWord = name.split(' ')[0];
    return `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(firstWord)}`;
  };

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

    const loadStats = async () => {
      const { data: itemsData } = await supabase
        .from('items')
        .select('id, bought')
        .eq('added_by', user.id);

      const { data: housesData } = await supabase
        .from('house_members')
        .select('id')
        .eq('user_id', user.id);

      const { data: boughtData } = await supabase
        .from('items')
        .select('id')
        .eq('bought_by', user.id)
        .eq('bought', true);

      setStats({
        totalItems: itemsData?.length || 0,
        housesJoined: housesData?.length || 0,
        itemsBought: boughtData?.length || 0,
      });
    };

    loadProfile();
    loadStats();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        language,
        notifications,
        phone,
        updated_at: new Date().toISOString(),
      });

    setIsSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setOriginalProfile({ full_name: fullName, language, notifications, phone });
    }
  };

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
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      await signOut();
      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar la cuenta');
    }
  };

  const hasChanges =
    originalProfile &&
    (fullName !== originalProfile.full_name ||
      language !== originalProfile.language ||
      notifications !== originalProfile.notifications ||
      phone !== originalProfile.phone);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Icon size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: spacing.xxxl,
      paddingBottom: spacing.huge,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: borderRadius.full,
      borderWidth: 4,
      borderColor: colors.onPrimary,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.md,
    },
    userName: {
      ...typography.h2,
      color: colors.onPrimary,
      marginBottom: spacing.xs,
    },
    userEmail: {
      ...typography.body,
      color: colors.onPrimary,
      opacity: 0.9,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      marginTop: -spacing.xxxl,
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    statCard: {
      minWidth: 100,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.md,
      alignItems: 'center',
      gap: spacing.sm,
    },
    statContent: {
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    statValue: {
      ...typography.h2,
      color: colors.onSurface,
    },
    statLabel: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
    },
    content: {
      paddingHorizontal: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.onBackground,
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
    inputIcon: {
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface,
    },
    pickerContainer: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.outline,
      ...shadows.sm,
      overflow: 'hidden',
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.outline,
      ...shadows.sm,
    },
    switchLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    switchLabel: {
      ...typography.bodyMedium,
      color: colors.onSurface,
    },
    buttonContainer: {
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
    },
    deleteButton: {
      marginTop: spacing.lg,
      marginBottom: spacing.xxxl,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <ScrollView style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: getDefaultAvatar(fullName) }}
              style={styles.avatar}
            />
            {/* <TouchableOpacity style={styles.cameraButton}>
              <Camera size={18} color={colors.onSecondary} />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.userName}>{fullName || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={ShoppingBag}
            label="Añadidos"
            value={stats.totalItems}
            color={colors.primary}
          />
          <StatCard
            icon={HomeIcon}
            label="Casas"
            value={stats.housesJoined}
            color={colors.secondary}
          />
          <StatCard
            icon={TrendingUp}
            label="Comprados"
            value={stats.itemsBought}
            color={colors.tertiary}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Tu nombre"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={user?.email || ''}
                  editable={false}
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color={colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Tu teléfono"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idioma</Text>
              <View style={styles.pickerContainer}>
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
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferencias</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Bell size={20} color={colors.onSurface} />
                <Text style={styles.switchLabel}>Notificaciones</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
                thumbColor={notifications ? colors.onPrimary : colors.onSurfaceVariant}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Guardar cambios"
              onPress={saveProfile}
              variant="primary"
              fullWidth
              loading={isSaving}
              disabled={!hasChanges}
            />
          </View>

          <View style={styles.deleteButton}>
            <Button
              title="Eliminar cuenta"
              onPress={deleteAccount}
              variant="danger"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
