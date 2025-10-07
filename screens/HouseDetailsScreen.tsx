import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Share } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { supabase } from '../supabase';
import { typography, spacing, borderRadius, shadows } from '../styles/designSystem';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { Copy, Share2, QrCode } from 'lucide-react-native';
import Button from '../components/Button';

export default function HouseDetailsScreen({ route, navigation }: any) {
  const { houseId } = route.params;
  const { colors } = useContext(ThemeContext);
  const [house, setHouse] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    loadHouseDetails();
  }, []);

  const loadHouseDetails = async () => {
    const { data: houseData } = await supabase
      .from('houses')
      .select('*')
      .eq('id', houseId)
      .single();

    const { data: membersData } = await supabase
      .from('house_members')
      .select('user_id, joined_at, profiles!inner(full_name)')
      .eq('house_id', houseId);

    setHouse(houseData);
    setMembers(membersData || []);
  };

  const copyCode = async () => {
    if (house?.invite_code) {
      await Clipboard.setStringAsync(house.invite_code);
      Alert.alert('Copiado', 'Código copiado al portapapeles');
    }
  };

  const shareCode = async () => {
    if (house?.invite_code) {
      try {
        await Share.share({
          message: `Únete a mi lista de compra en Shopping House con este código: ${house.invite_code}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.xl,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      marginBottom: spacing.lg,
      ...shadows.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.onSurface,
      marginBottom: spacing.lg,
    },
    qrContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    codeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surfaceVariant,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginTop: spacing.lg,
    },
    code: {
      ...typography.h2,
      color: colors.onSurface,
      fontFamily: 'Inter-Bold',
      letterSpacing: 2,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    memberItem: {
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    memberName: {
      ...typography.bodyMedium,
      color: colors.onSurface,
    },
    memberDate: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
      marginTop: spacing.xs,
    },
  });

  if (!house) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Código de invitación</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={house.invite_code}
              size={200}
              backgroundColor={colors.surface}
              color={colors.onSurface}
            />
          </View>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{house.invite_code}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={copyCode}>
              <Copy size={20} color={colors.onPrimaryContainer} />
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <Button
              title="Compartir código"
              onPress={shareCode}
              variant="primary"
              fullWidth
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Miembros ({members.length})</Text>
          {members.map((member, index) => (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberName}>
                {member.profiles?.full_name || 'Usuario'}
              </Text>
              <Text style={styles.memberDate}>
                Unido: {new Date(member.joined_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
