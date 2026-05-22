import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { FridgeContext } from '../context/FridgeContext';

const categories = [
  { label: 'All Categories', value: 'All' },
  { label: 'Bread & Baked Goods', value: 'Bread & Baked Goods' },
  { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
  { label: 'Fish & Meat', value: 'Fish & Meat' },
  { label: 'Fruit & Veggies', value: 'Fruit & Veggies' },
  { label: 'Grains', value: 'Grains' },
  { label: 'Pasta & Rice', value: 'Pasta & Rice' },
  { label: 'Preserves & Sauces', value: 'Preserves & Sauces' },
  { label: 'Other', value: 'Other' },
];

export default function Fridge({ navigation }) {

  const {
    items,
    removeItem,
    decreaseQty
  } = useContext(FridgeContext);

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }


  const filteredInventory = items.filter(item => {

    if (selectedCategory === 'All') {
      return true;
    }

    return item.category === selectedCategory;
  });

  const renderItem = ({ item }) => (

    <View style={styles.tile}>
      <View style={styles.tileHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
          
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.minusButton} onPress={() => decreaseQty(item.id)}>
            <Text style={styles.minusText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.itemQty}>{item.qty}</Text>
        </View>
      </View>

      <View style={styles.tileFooter}>

        <Text style={styles.dateLabel}> Purchased: {item.addedAt} </Text>
        <Text style={[ styles.dateLabel, styles.expiryText]}>Expires: {item.expiryDate}</Text>
          
            
        <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)} >
          <Text style={{ color: 'red' }}> Remove </Text>
        </TouchableOpacity>

      </View>

    </View>
  );

  return (

    <View style={styles.container}>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item =>
          setSelectedCategory(item.value)
        }
      />

      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item =>
          item.id.toString()
        }
        ListEmptyComponent={

          <Text style={styles.emptyText}>
            No items found in this category.
          </Text>

        }
      />

    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 10, 
  },
  
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  placeholderStyle: { 
    fontSize: 16, 
    color: '#888' 
  },

  selectedTextStyle: { 
    fontSize: 16, 
    color: '#333' 
  },

  tile: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  tileHeader: { 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  marginBottom: 10,
 },

  itemName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333',
 },

  itemQty: { 
    fontSize: 16, 
    color: '#666' 
  },

  tileFooter: { 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingTop: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
 },

  dateLabel: { 
    fontSize: 12, 
    color: '#888' 
  },
  expiryText: { 
    color: '#e74c3c', 
    fontWeight: 'bold', 
    marginTop: 2 
  },

  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 5,
  },
  addButtonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },

  emptyText: { 
    textAlign: 'center', 
    fontFamily: 'NunitoSemiBold',
    marginTop: 50, 

    color: '#999' 
  },

  qtyContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
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
    fontWeight: 'bold'
   },

});