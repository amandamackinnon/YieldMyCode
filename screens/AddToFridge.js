import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

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

export default function AddToFridge({ onAddProduct, route, navigation }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSave = () => {
    // 1. Validate Info First
    if (!name.trim() || !qty.trim() || !category) {
      Alert.alert(
        "Missing Info",
        "Please fill in all fields and select a category before saving.",
        [{ text: "OK" }]
      );
      return;
    }

    // 2. Create the Item Object (Now properly initialized BEFORE using it)
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      qty: qty,
      category: category,
      addedAt: new Date().toLocaleDateString(),
      expiryDate: expiryDate.toLocaleDateString(),
    };

    // 3. Send data up via Prop and navigate
    if (onAddProduct) {
      onAddProduct(newItem);
      
      // Clear out the states for a fresh form next time
      setName('');
      setQty('');
      setCategory(null);
      setExpiryDate(new Date());

      // Safely bounce back to the main list view screen
      navigation.navigate('FridgeHome');
    } else {
      console.warn("onAddProduct prop was not found.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a product: </Text>
      <Text style={styles.subheading}>Type the name of your product</Text>

      <Dropdown
        style={styles.dropdown}
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Select Category"
        value={category}
        onChange={item => setCategory(item.value)}
      />

      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput 
        placeholder="Quantity" 
        style={styles.input} 
        keyboardType="numeric" 
        value={qty} 
        onChangeText={setQty} 
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>Expires: {expiryDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subheading: {
    fontSize: 20,
    marginBottom: 15
  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    marginVertical: 8,
    padding: 10,
    fontSize: 18,
    borderRadius: 4
  },
  dropdown: {
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginLeft: 100,
    marginRight: 100,
    borderColor: "rgba(236, 96, 57, 1)",
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'rgba(236, 96, 57, 1)',
    fontWeight: 'bold',
    fontSize: 18
  }
});