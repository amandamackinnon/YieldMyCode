import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
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

const getDaysLeft = (expiryDateStr) => {
  if (!expiryDateStr) return '';

  try {
    // 1. Separate the clean components
    const parts = expiryDateStr.trim().split('/');
    if (parts.length !== 3) return 'Invalid Date';

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed months
    const year = parseInt(parts[2], 10);

    // 2. Create absolute UTC Midnight references (Timezone Neutral)
    const expiryDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));

    // 3. Compute absolute physical days difference using Math.round
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // 🔍 Debug log to verify the fresh calculation values
    console.log(`📊 Math Check -> Expiry UTC: ${expiryDate.toUTCString()} | Today UTC: ${today.toUTCString()} | Diff Days: ${diffDays}`);

    // 4. Return clean strings
    if (diffDays === 0) {
      return 'Expires today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else if (diffDays < 0) {
      const positiveDays = Math.abs(diffDays);
      return `Expired ${positiveDays} ${positiveDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return `${diffDays} days left`;
    }
  } catch (error) {
    console.log('❌ Date calculation error:', error);
    return 'Date error';
  }
};

export default function Fridge({ navigation }) {
  const { items, removeItem, decreaseQty } = useContext(FridgeContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // FIXED: Added block syntax curly braces and return statement here
  const renderItem = ({ item }) => {
    const daysLeftText = getDaysLeft(item.expiryDate);

    return (
      <View style={styles.tile}>
        <View style={styles.tileHeader}>
          <View style={styles.imageBackgroundCircle}>
            <Image 
              source={{ uri: item.imageUrl || 'https://spoonacular.com/cdn/ingredients_250x250/apple.png' }} 
              style={styles.foodImage} 
              resizeMode="contain"
            />   
          </View>
          <Text style={styles.itemName}>{item.name}</Text>
            
          <View style={styles.qtyContainer}>
            <Text style={styles.itemQty}>{item.qty}</Text>
            <TouchableOpacity style={styles.minusButton} onPress={() => decreaseQty(item.id)}>
              <Text style={styles.minusText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
              <Text style={{ color: 'red' }}> Remove </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tileFooter}>
          {/* UPDATED: Changed from raw date string to daysLeftText */}
          <Text style={[styles.dateLabel, styles.expiryText]}>{daysLeftText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.dropdownItemText}
        placeholder=""
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        renderLeftIcon={() => (
          <Ionicons name="search" size={25} color="white" />
        )}
        renderRightIcon={() => null}
      />

      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.emptyText}> No items found in this category.</Text>
        } 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white', 
    paddingHorizontal: 10,
    paddingTop: 0, 
  },

  row: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  
  dropdown: {
    backgroundColor: '#D9D9D966',
    borderRadius: 2,
    padding: 12,
    marginBottom: 15,
    
  },

  placeholderStyle: { 
    fontSize: 16, 
    color: '#888', 
    fontFamily: 'NunitoMedium',
  },

  selectedTextStyle: { 
    fontSize: 1,       
    color: 'transparent', 
  },

   dropdownItemText: { 
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoMedium',
  },

  tile: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    elevation: 1,
  
  },

  tileHeader: { 
  flexDirection: 'column', 
  justifyContent: 'space-between', 
  marginBottom: 10,
 },

  itemName: { 
    fontSize: 18, 
    fontFamily: 'NunitoBold',
    color: '#333',
    
 },

  itemQty: { 
    fontSize: 16, 
    color: '#666',
    fontFamily: 'NunitoMedium', 
  },

  tileFooter: { 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingTop: 10, 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems: 'center'
 },

  dateLabel: { 
    fontSize: 12, 
    color: '#888',
    fontFamily: 'NunitoMedium',
  },
  expiryText: { 
    color: '#e74c3c', 
    marginTop: 2 
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

  imageBackgroundCircle: {
    width: '90%',                    
    borderRadius: 4,              
    backgroundColor: 'rgba(79, 107, 183, 1)', 
    justifyContent: 'center', 
    alignItems: 'center',     
    overflow: 'hidden',
  },

  foodImage: {
    width: 100,                
    height: 100,
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