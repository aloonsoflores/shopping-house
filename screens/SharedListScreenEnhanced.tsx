import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, Animated, Dimensions } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows, touchTargetSize } from '../styles/designSystem';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { ShoppingCart, Check, Trash2, Plus, Search, ListFilter as Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type FilterType = 'all' | 'pending' | 'bought';

export default function SharedListScreen({ route }: any) {
  const { houseId } = route.params;
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('house_id', houseId)
      .order('created_at', { ascending: true });

    if (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }

    setItems(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();

    const channel = supabase.channel(`items-house-${houseId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'items',
        filter: `house_id=eq.${houseId}`
      }, () => {
        loadItems();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [houseId]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ? true :
      filterType === 'pending' ? !item.bought :
      filterType === 'bought' ? item.bought : true;

    return matchesSearch && matchesFilter;
  });

  const addItem = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión primero");
      return;
    }

    if (!text.trim()) return;

    setIsAddingItem(true);
    await supabase.from('items').insert([{
      house_id: houseId,
      name: text.trim(),
      quantity: quantity,
      added_by: user.id
    }]);

    setText('');
    setQuantity(1);
    setIsAddingItem(false);
  };

  const toggleBought = async (item: any) => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión primero");
      return;
    }

    await supabase.from('items').update({
      bought: !item.bought,
      bought_by: !item.bought ? user.id : null,
      updated_at: new Date().toISOString()
    }).eq('id', item.id);
  };

  const deleteItem = async (itemId: string) => {
    await supabase.from('items').delete().eq('id', itemId);
  };

  const renderItem = ({ item }: any) => {
    return (
      <Animated.View style={styles.itemContainer}>
        <TouchableOpacity
          style={[styles.itemContent, item.bought && styles.itemBought]}
          onPress={() => toggleBought(item)}
          activeOpacity={0.7}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.checkbox, item.bought && styles.checkboxChecked]}>
              {item.bought && <Check size={20} color={colors.onSuccess} strokeWidth={3} />}
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemText, item.bought && styles.itemTextBought]}>
                {item.name}
              </Text>
              {item.quantity > 1 && (
                <Text style={styles.quantityBadge}>x{item.quantity}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHiddenItem = ({ item }: any) => {
    return (
      <View style={styles.hiddenItemContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Trash2 size={24} color={colors.onError} />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const FilterChip = ({ type, label }: { type: FilterType; label: string }) => {
    const isActive = filterType === type;
    return (
      <TouchableOpacity
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => setFilterType(type)}
      >
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      ...shadows.sm,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    filterChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    filterChipActive: {
      backgroundColor: colors.primaryContainer,
      borderColor: colors.primary,
    },
    filterChipText: {
      ...typography.captionMedium,
      color: colors.onSurface,
    },
    filterChipTextActive: {
      color: colors.onPrimaryContainer,
    },
    inputSection: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      gap: spacing.md,
    },
    inputRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      height: touchTargetSize.comfortable,
      ...typography.body,
      color: colors.onSurface,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.outline,
      overflow: 'hidden',
    },
    quantityButton: {
      width: 40,
      height: touchTargetSize.comfortable,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryContainer,
    },
    quantityButtonText: {
      ...typography.h3,
      color: colors.onPrimaryContainer,
    },
    quantityText: {
      ...typography.bodyMedium,
      color: colors.onSurface,
      minWidth: 40,
      textAlign: 'center',
    },
    addButton: {
      width: touchTargetSize.comfortable,
      height: touchTargetSize.comfortable,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.md,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    itemContainer: {
      marginBottom: spacing.md,
    },
    itemContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    itemBought: {
      backgroundColor: colors.surfaceVariant,
      opacity: 0.7,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.full,
      borderWidth: 2,
      borderColor: colors.outline,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    itemTextContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    itemText: {
      ...typography.bodyMedium,
      color: colors.onSurface,
      flex: 1,
    },
    itemTextBought: {
      textDecorationLine: 'line-through',
      color: colors.onSurfaceVariant,
    },
    quantityBadge: {
      ...typography.captionMedium,
      color: colors.onSecondaryContainer,
      backgroundColor: colors.secondaryContainer,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    hiddenItemContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    deleteButton: {
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
      borderRadius: borderRadius.lg,
      gap: spacing.xs,
    },
    deleteButtonText: {
      ...typography.captionMedium,
      color: colors.onError,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <SkeletonList count={8} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterChip type="all" label="Todos" />
        <FilterChip type="pending" label="Pendientes" />
        <FilterChip type="bought" label="Comprados" />
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Añadir producto..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={text}
            onChangeText={setText}
            onSubmitEditing={addItem}
            returnKeyType="done"
          />
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addItem}
            disabled={isAddingItem || !text.trim()}
          >
            <Plus size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No se encontraron productos" : "Lista vacía"}
          description={searchQuery ? "Intenta con otro término de búsqueda" : "Añade tu primer producto para empezar"}
          actionLabel={!searchQuery ? "Añadir producto" : undefined}
          onAction={() => {}}
        />
      ) : (
        <SwipeListView
          data={filteredItems}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          disableRightSwipe
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}
