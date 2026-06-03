import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';

export default function ItemDetails({ route, navigation }) {
  const { itemId } = route.params;
  
  const { items, increaseQty, decreaseQty, removeItem } = useContext(FridgeContext);

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item no longer exists.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.largeImage} resizeMode="contain" />
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.genText}>Left in the fridge: </Text>

      <View style={styles.counterRow}>
        
        <Text style={styles.quantityText}>{item.qty}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => decreaseQty(item.id)}>
          <Ionicons name="remove-sharp" size={50} color="#FFF"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.counterButton} onPress={() => increaseQty(item.id)}>
          <Ionicons name="add-sharp" size={50} color="#FFF"/>
        </TouchableOpacity>
      </View>


      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => {
          removeItem(item.id);
          navigation.goBack(); 
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4E23" style={{ marginRight: 6 }} />
        <Text style={styles.removeButtonText}>Remove Item from Fridge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  mainCard: {
    width: '85%',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  largeImage: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
    genText: {
        marginTop: 35,
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: 40,
        fontSize: 20,
        fontWeight: 'bold',

    },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 40,
  },
  counterButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E7B1A6',
    backgroundColor: '#E7B1A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#333',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    padding: 12,
  },
  removeButtonText: {
    color: '#EF4E23',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  }
});