import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';
import { AuthContext } from '../contexts/AuthContext';
import { globalStyles } from '../styles/global';

export default function SharedListScreen({ route }: any) {
  const { houseId } = route.params;
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('house_id', houseId)
      .order('created_at', { ascending: true });
    if (error) return console.log(error);
    setItems(data ?? []);
  };

  useEffect(() => {
    loadItems();

    // Suscripción a cambios (postgres_changes sobre tabla items)
    const channel = supabase.channel(`items-house-${houseId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `house_id=eq.${houseId}` }, (payload) => {
        // handle insert/update/delete
        loadItems(); // simple y fiable para MVP
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [houseId]);

  const addItem = async () => {
    if (!user) return Alert.alert("Debes iniciar sesión primero");

    if (!text) return;
    await supabase.from('items').insert([{ house_id: houseId, name: text, added_by: user.id }]);
    setText('');
    // la suscripción actualizará la lista
  };

  const toggleBought = async (item: any) => {
    if (!user) return Alert.alert("Debes iniciar sesión primero");

    await supabase.from('items').update({
      bought: !item.bought,
      bought_by: !item.bought ? user.id : null,
      updated_at: new Date().toISOString()
    }).eq('id', item.id);
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.sectionTitle}>Lista Compartida</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput
          style={[globalStyles.input, { flex: 1 }]}
          placeholder="Añadir producto..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={[globalStyles.button, { marginLeft: 8 }]} onPress={addItem}>
          <Text style={globalStyles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleBought(item)}
            style={[globalStyles.listItem, item.bought && globalStyles.listItemBought]}
          >
            <Text style={[globalStyles.listItemText, item.bought && { textDecorationLine: 'line-through' }]}>
              {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
            </Text>
            <Text style={globalStyles.listItemSubText}>{item.added_by}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
