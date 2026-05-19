import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Dropdown } from 'react-native-element-dropdown'; 

const categories = [
  { label: 'Fruit', value: 'Fruit' },
  { label: 'Vegetables', value: 'Vegetables' },
  { label: 'Meat', value: 'Meat' },
  { label: 'Fish', value: 'Fish' },
  { label: 'Dairy/Eggs', value: 'Dairy/Eggs' },
  { label: 'Preserves/Condiments', value: 'Preserves/Condiments' },
  { label: 'Bread/Baked Goods', value: 'Bread/Baked Goods' },
  { label: 'Other', value: 'Other' },
];

export default function AddToFridge({ onAddProduct, navigation }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

const onDateChange = (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    setExpiryDate(selectedDate);
  }
};
  
  
  const [expiryDate, setExpiryDate] = useState(new Date()); 

  const handleSave = () => {
    if (!name || !qty || !category) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: name,
      qty: qty,
      category: category,
      addedAt: new Date().toLocaleDateString(), 
      expiryDate: expiryDate.toLocaleDateString(), 
    };

    onAddProduct(newItem);
    navigation.goBack();
  };

  return (
    <View style={styles.container}> 
       <Text style={styles.title}>Add Item to Fridge</Text>
       
       <TextInput 
          placeholder="Item Name" 
          style={styles.input}
          value={name}
          onChangeText={setName}
       />

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
          <Text style={styles.buttonText}>Save to Fridge</Text>
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
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10, fontSize: 18 },
  dropdown: { height: 50, borderBottomWidth: 1, marginBottom: 20 },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});