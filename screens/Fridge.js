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
  if (!expiryDateStr || typeof expiryDateStr !== 'string' || expiryDateStr.trim() === '') {
    return { text: 'No Expiry Set', days: 999 };
  }

  try {
  const cleanStr = expiryDateStr.replace(/Expires:\s*/i, '').trim();
  const dateParts = cleanStr.split('/');
    if (dateParts.length !== 3) {
      return { text: 'Invalid Format', days: 999 };
    }
  const [dayStr, monthStr, yearStr] = dateParts;
  const expDay = parseInt(dayStr, 10);
  const expMonth = parseInt(monthStr, 10) - 1; 
  const expYear = parseInt(yearStr, 10);

    if (isNaN(expDay) || isNaN(expMonth) || isNaN(expYear)) {
      return { text: 'Invalid Numbers', days: 999 };
    }

    const expiryDate = new Date(expYear, expMonth, expDay, 12, 0, 0);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));


    if (diffDays === 0) {
      return { text: 'Expires today', days: diffDays };
    } else if (diffDays === 1) {
      return { text: '1 day left', days: diffDays };
    } else if (diffDays < 0) {
      const positiveDays = Math.abs(diffDays);
      return { 
        text: `Expired ${positiveDays} ${positiveDays === 1 ? 'day' : 'days'} ago`, 
        days: diffDays 
      };
    } else {
      return { text: `${diffDays} days left`, days: diffDays };
    }

  } catch (error) {
    return { text: 'Calc Error', days: 999 };
  }
};

const TILE_COLORS = [
  '#4F6BB7', 
  '#E7B1A6', 
  '#B2DFE8', 
  '#EC6039', 
  '#E7C665', 
  '#699966', 
];

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

  const renderItem = ({ item, index }) => { // <-- Added index here!
    const info = getDaysLeft(item.expiryDate);

    let statusStyle = null;
    let bannerElement = null; 

    if (info.days <= 0) {
      statusStyle = styles.urgentRed;
      bannerElement = (
        <View style={[styles.bannerOverlay, styles.bannerRed]}>
          <Text style={styles.bannerText}>😭 EXPIRED</Text>
        </View>
      );
    } else if (info.days >= 1 && info.days <= 2) {
      statusStyle = styles.urgentRed;
      bannerElement = (
        <View style={[styles.bannerOverlay, styles.bannerRed]}>
          <Text style={styles.bannerText}>⏰ PLEASE HURRY!</Text>
        </View>
      );
    } else if (info.days >= 3 && info.days <= 4) {
      statusStyle = styles.warningYellow;
      bannerElement = (
        <View style={[styles.bannerOverlay, styles.bannerOrange]}>
          <Text style={styles.bannerText}>⏳ SLOWLY DYING...</Text>
        </View>
      );
    } else {
      statusStyle = styles.safeGreen;
    }

    
    const backgroundColor = TILE_COLORS[index % TILE_COLORS.length];

    return (
      <View style={styles.tile}>
        <View style={styles.tileHeader}>
          <View style={[styles.imageBackgroundCircle, { backgroundColor }]}>
  
  {/* NEW: This inner white circle contains the image beautifully */}
  <View style={styles.innerWhiteCircle}>
    <Image 
      source={{ uri: item.imageUrl || 'https://spoonacular.com/cdn/ingredients_250x250/apple.png' }} 
      style={styles.foodImage} 
      resizeMode="contain"
    />   
  </View>

  {bannerElement} 
  <Text style={styles.itemName}>{item.name}</Text>
</View>
          
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
          <Text style={[styles.expiryText, statusStyle]}>{info.text}</Text>
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
        placeholder="Filter Category"
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        renderLeftIcon={() => (
          <Ionicons name="search" size={25} color="white" style={{ marginRight: 10 }} />
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
    alignItems: 'center',
  },

  itemName: { 
    fontSize: 16, 
    fontFamily: 'NunitoBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2, // Tucks it neatly near the bottom of the colored tile
  },

   foodImage: {
    width: 75,                
    height: 75,
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
    alignItems: 'center',
    width: '100%',
  },
  dateLabel: { 
    fontSize: 12, 
    color: '#888',
    fontFamily: 'NunitoMedium',
  },
  expiryText: { 
    marginTop: 4, 
    borderWidth: 1, 
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: 'NunitoMedium',
    fontSize: 14,
    borderRadius: 6,
    overflow: 'hidden', 
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  urgentRed: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF3800',
    color: '#FF3800',
  },
  warningYellow: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFC700',
    color: '#FFC700',
  },
  safeGreen: {
    backgroundColor: '#E8F5E9',
    borderColor: '#388E3C',
    color: '#2E7D32',
  },
  emptyText: { 
    textAlign: 'center', 
    fontFamily: 'NunitoSemiBold',
    marginTop: 50, 
    color: '#999' 
  },
  qtyContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 4,
  },

  imageBackgroundCircle: {
    width: 150,                    
    height: 150,
    borderRadius: 12, // Slightly rounder corners look incredibly premium with this style!
    justifyContent: 'space-between', // Pushes the inner circle to top, text to bottom
    alignItems: 'center',     
    overflow: 'hidden', 
    position: 'relative',
    paddingVertical: 10, // Gives the text and inner circle some breathing room
  },

  innerWhiteCircle: {
    width: 100,
    height: 100,
    borderRadius: 95 / 2, // Perfect circle anchor
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, 
  },

  
  bannerOverlay: {
    position: 'absolute',
    bottom: '30%', 
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  bannerRed: {
    backgroundColor: '#FF3800', 
  },
  bannerOrange: {
    backgroundColor: '#FFC70080', 
  },
  bannerText: {
    color: 'white',
    fontFamily: 'NunitoBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
 
  minusButton: {
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  minusText: { 
    fontSize: 20, 
    color: '#e74c3c', 
    fontWeight: 'bold'
  },
  deleteButton: {
    marginLeft: 5,
  }
});