import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Switch, Modal } from 'react-native';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { Hop as Home, Plus, LogIn, User, Sun, Moon, LogOut, ChevronRight } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'HouseSetup'>;

type UserHouse = {
  id: string;
  name: string;
};

export default function HouseSetupScreen({ navigation }: Props) {
  const { colors, toggleTheme, theme } = useContext(ThemeContext);
  const { user, signOut } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [houses, setHouses] = useState<UserHouse[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const loadHouses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('house_members')
      .select('house_id, houses!inner(name)')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
      return;
    }

    const mapped: UserHouse[] = (data ?? []).map((d: any) => ({
      id: d.house_id,
      name: d.houses.name,
    }));

    setHouses(mapped);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHouses();
  }, []);

  const createHouse = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión primero");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Error", "El nombre de la casa no puede estar vacío");
      return;
    }

    setIsCreating(true);
    const code = genCode();
    const { data: newHouse, error: createError } = await supabase
      .from('houses')
      .insert([{ name: name.trim(), invite_code: code }])
      .select()
      .single();

    if (createError) {
      Alert.alert('Error', createError.message);
      setIsCreating(false);
      return;
    }

    await supabase.from('house_members').insert([{ house_id: newHouse.id, user_id: user?.id }]);
    setName('');
    await loadHouses();
    setIsCreating(false);
    navigation.navigate('SharedList', { houseId: newHouse.id });
  };

  const joinHouse = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión primero");
      return;
    }

    if (!inviteCode.trim()) {
      Alert.alert("Error", "Introduce un código de invitación");
      return;
    }

    setIsJoining(true);
    const { data: house, error } = await supabase
      .from('houses')
      .select()
      .eq('invite_code', inviteCode.toUpperCase())
      .maybeSingle();

    if (error) {
      Alert.alert('Error', error.message);
      setIsJoining(false);
      return;
    }

    if (!house) {
      Alert.alert('Error', 'Código de invitación no válido');
      setIsJoining(false);
      return;
    }

    await supabase.from('house_members').insert([{ house_id: house.id, user_id: user?.id }]);
    setInviteCode('');
    await loadHouses();
    setIsJoining(false);
    navigation.navigate('SharedList', { houseId: house.id });
  };

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.huge,
      paddingBottom: spacing.xl,
      backgroundColor: colors.primary,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    headerTitle: {
      ...typography.h1,
      color: colors.onPrimary,
    },
    profileButton: {
      width: touchTargetSize.minimum,
      height: touchTargetSize.minimum,
      borderRadius: borderRadius.full,
      backgroundColor: colors.onPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileText: {
      ...typography.h3,
      color: colors.primary,
    },
    headerSubtitle: {
      ...typography.body,
      color: colors.onPrimary,
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
    },
    section: {
      marginBottom: spacing.xxxl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.onBackground,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.md,
      marginBottom: spacing.md,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface,
      borderWidth: 1,
      borderColor: colors.outline,
      marginBottom: spacing.md,
    },
    houseItem: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    houseItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    houseIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    houseItemText: {
      ...typography.bodyMedium,
      color: colors.onSurface,
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      marginTop: spacing.huge + spacing.xl,
      marginRight: spacing.lg,
      width: 250,
      ...shadows.xl,
      overflow: 'hidden',
    },
    modalHeader: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    modalEmail: {
      ...typography.bodyMedium,
      color: colors.onSurface,
    },
    modalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
    modalText: {
      ...typography.body,
      color: colors.onSurface,
      flex: 1,
    },
    modalDivider: {
      height: 1,
      backgroundColor: colors.outline,
      marginVertical: spacing.sm,
    },
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Shopping House</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => setMenuVisible(true)}>
            <Text style={styles.profileText}>
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Gestiona tus listas de compra compartidas</Text>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalEmail}>{user?.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <User size={20} color={colors.onSurface} />
              <Text style={styles.modalText}>Perfil</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <View style={styles.modalItem}>
              {theme === 'light' ? (
                <Sun size={20} color={colors.onSurface} />
              ) : (
                <Moon size={20} color={colors.onSurface} />
              )}
              <Text style={styles.modalText}>
                {theme === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
              </Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
                thumbColor={theme === 'dark' ? colors.onPrimary : colors.onSurfaceVariant}
              />
            </View>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalItem}
              onPress={async () => {
                setMenuVisible(false);
                await signOut();
                navigation.replace('SignIn');
              }}
            >
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.modalText, { color: colors.error }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Plus size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Crear casa</Text>
          </View>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la casa"
              placeholderTextColor={colors.onSurfaceVariant}
              value={name}
              onChangeText={setName}
            />
            <Button
              title="Crear"
              onPress={createHouse}
              variant="primary"
              fullWidth
              loading={isCreating}
              disabled={!name.trim()}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LogIn size={24} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Unirse con código</Text>
          </View>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Código de invitación"
              placeholderTextColor={colors.onSurfaceVariant}
              value={inviteCode}
              onChangeText={(text) => setInviteCode(text.toUpperCase())}
              autoCapitalize="characters"
            />
            <Button
              title="Unirse"
              onPress={joinHouse}
              variant="secondary"
              fullWidth
              loading={isJoining}
              disabled={!inviteCode.trim()}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home size={24} color={colors.tertiary} />
            <Text style={styles.sectionTitle}>Mis casas</Text>
          </View>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : houses.length === 0 ? (
            <EmptyState
              title="No tienes casas"
              description="Crea una nueva casa o únete usando un código de invitación"
              showAnimation={false}
            />
          ) : (
            <FlatList
              data={houses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.houseItem}
                  onPress={() => navigation.navigate('SharedList', { houseId: item.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.houseItemLeft}>
                    <View style={styles.houseIcon}>
                      <Home size={24} color={colors.onPrimaryContainer} />
                    </View>
                    <Text style={styles.houseItemText}>{item.name}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}
