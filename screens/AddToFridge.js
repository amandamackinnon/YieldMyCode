import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { FridgeContext } from '../context/FridgeContext';
import { BlurView } from 'expo-blur';


const categories = [
  { label: 'Bread & Baked Goods', value: 'Bread & Baked Goods' },
  { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
  { label: 'Fish & Meat', value: 'Fish & Meat' },
  { label: 'Fruit & Veggies', value: 'Fruit & Veggies' },
  { label: 'Grains', value: 'Grains' },
  { label: 'Pasta & Rice', value: 'Pasta & Rice' },
  { label: 'Preserves & Sauces', value: 'Preserves & Sauces' },
  { label: 'Other', value: 'Other' },
];

export default function AddToFridge({ navigation }) {
  const { addItem } = useContext(FridgeContext);

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !qty.trim() || !category) {
      Alert.alert('Missing Info', 'Please fill in all fields and select a category before saving.', [{ text: 'OK' }]);
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      qty: Number(qty),
      category: category,
      addedAt: new Date().toLocaleDateString(),
      expiryDate: expiryDate.toLocaleDateString(),
    };

    addItem(newItem);
    setName('');
    setQty('');
    setCategory(null);
    setExpiryDate(new Date());

    navigation.navigate('FridgeHome');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* 1. Full screen blur background */}
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject}>
        {/* Invisible touchable area to dismiss modal when tapping outside */}
        <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={() => navigation.goBack()} />
      </BlurView>

      <View style={styles.modalCard}>
        <Image 
    source={require('../assets/modal-tile-image.png')} 
    style={styles.illustration} 
  />
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <View style={styles.circle}>
          <Text style={styles.closeButtonText}>✕</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.heading}>Add a product:</Text>
        <Text style={styles.subheading}>Type the name of your product</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={category}
          onChange={item => setCategory(item.value)}
        />
          
        <TextInput
          placeholder="Product Name..."
          placeholderTextColor="#000000"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Quantity..."
          placeholderTextColor="#000000"
          style={styles.input}
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
        />

        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}> Expires: {expiryDate.toLocaleDateString()} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: 'transparent', 
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderWidth: 4,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
illustration: {
  width: 100,            // Adjust size to fit your design
  height: 100,           // Keep width and height equal for a perfect circle
  position: 'absolute',  // Takes it out of normal layout flow
  top: -50,              // Pulls it halfway up over the top border line
  left: 20,              // Positions it on the left side
  zIndex: 5,             // Ensures it sits on top of the border line
},

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
    
  },
 
circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 24,
    fontFamily: 'NunitoBold',
    color: '#333',
    marginBottom: 6,
    marginTop: 8,
  },
  subheading: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    marginVertical: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },
  dropdownSelectedText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },

  selectedTextStyle: { 
    fontSize: 16, 
    color: '#333', 
    fontFamily: 'NunitoBold',  
  },

   dropdownItemText: { 
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoMedium',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 4, 
    borderColor: "rgba(236, 96, 57, 1)",
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 24,
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'rgba(236, 96, 57, 1)',
    fontFamily: 'NunitoBold',
    fontSize: 15,
    textTransform: 'uppercase',
  }

  
});