import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

export default function Fridge({inventory, navigation, onDeleteItem, onDecreaseQty}) {

const renderItem = ({ item }) => (
    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            style={styles.minusButton} 
            onPress={() => onDecreaseQty(item.id)}
          >
            <Text style={styles.minusText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.itemQty}>{item.qty}</Text>
        </View>
      </View>
      
      <View style={styles.tileFooter}>
        <Text style={styles.dateLabel}>Purchased: {item.addedAt}</Text>
        <Text style={[styles.dateLabel, styles.expiryText]}>
          Expires: {item.expiryDate}
        </Text>

        <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDeleteItem(item.id)}
>
  <Text style={{color: 'red'}}>Remove</Text>
</TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your fridge is empty! Add something.</Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddToFridge')}
      >
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    // This adds a subtle shadow for the "tile" look
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tileHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemQty: { fontSize: 16, color: '#666' },
  tileFooter: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  dateLabel: { fontSize: 12, color: '#888' },
  expiryText: { color: '#e74c3c', fontWeight: 'bold', marginTop: 2 },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 5,
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minusButton: {
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  minusText: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});