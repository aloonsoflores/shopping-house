import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Switch, Modal } from 'react-native';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { ThemeContext } from '../contexts/ThemeContext';

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

  const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  // Cargar casas unidas
  const loadHouses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('house_members')
      .select('house_id, houses!inner(name)')
      .eq('user_id', user.id);

    if (error) return Alert.alert('Error', error.message);

    const mapped: UserHouse[] = (data ?? []).map((d: any) => ({
      id: d.house_id,
      name: d.houses.name,
    }));

    setHouses(mapped);
  };

  useEffect(() => {
    loadHouses();
  }, []);

  const createHouse = async () => {
    if (!user) return Alert.alert("Debes iniciar sesión primero");

    const code = genCode();
    const { data: newHouse, error: createError } = await supabase
      .from('houses')
      .insert([{ name, invite_code: code }])
      .select()
      .single();
    if (createError) return Alert.alert('Error', createError.message);

    await supabase.from('house_members').insert([{ house_id: newHouse.id, user_id: user?.id }]);
    await loadHouses();
    navigation.navigate('SharedList', { houseId: newHouse.id });
  };

  const joinHouse = async () => {
    if (!user) return Alert.alert("Debes iniciar sesión primero");

    const { data: house, error } = await supabase
      .from('houses')
      .select()
      .eq('invite_code', inviteCode)
      .maybeSingle();
    if (error) return Alert.alert('Error', error.message);
    if (!house) return Alert.alert('Código no válido');

    await supabase.from('house_members').insert([{ house_id: house.id, user_id: user?.id }]);
    await loadHouses();
    navigation.navigate('SharedList', { houseId: house.id });
  };

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 48,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    profileButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileText: {
      color: colors.onPrimaryContainer,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginTop: 60,
      marginRight: 16,
      width: 220,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    modalItem: {
      paddingVertical: 10,
    },
    modalText: {
      fontSize: 16,
      color: colors.onSurface,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.onBackground,
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
      marginBottom: 16,
    },
    buttonText: {
      color: colors.onPrimary,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    houseItem: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    houseItemText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.onSurface,
    },
  });

  return (
    <View style={styles.screen}>
      {/* Header con botón de perfil */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={() => setMenuVisible(true)}>
          <Text style={styles.profileText}>
            {user?.email?.charAt(0).toUpperCase() ?? "U"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal desplegable */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.modalContent}>
            {/* Info personal */}
            <TouchableOpacity style={styles.modalItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Profile'); // 👈 aquí puedes llevar a pantalla de perfil
            }}>
              <Text style={styles.modalText}>Información personal</Text>
            </TouchableOpacity>

            {/* Switch tema */}
            <View style={[styles.modalItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <Text style={styles.modalText}>
                {theme === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
              </Text>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.primaryContainer, true: colors.primary }}
                thumbColor={theme === 'dark' ? colors.onPrimary : colors.onPrimaryContainer}
              />
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.modalItem} onPress={async () => {
              setMenuVisible(false);
              await signOut();
              navigation.replace('SignIn');
            }}>
              <Text style={[styles.modalText, { color: colors.error }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Resto de la pantalla */}
      <Text style={styles.sectionTitle}>Crear casa</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la casa"
        placeholderTextColor={colors.onSurfaceVariant}
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={createHouse}>
        <Text style={styles.buttonText}>Crear</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Unirse con código</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de invitación"
        placeholderTextColor={colors.onSurfaceVariant}
        value={inviteCode}
        onChangeText={setInviteCode}
      />
      <TouchableOpacity style={styles.button} onPress={joinHouse}>
        <Text style={styles.buttonText}>Unirse</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mis casas</Text>
      <FlatList
        data={houses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.houseItem}
            onPress={() => navigation.navigate('SharedList', { houseId: item.id })}
          >
            <Text style={styles.houseItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
