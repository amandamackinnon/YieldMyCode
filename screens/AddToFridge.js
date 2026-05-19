import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Dropdown } from 'react-native-element-dropdown'; 

const categories = [
  { label: 'Bread & Baked Goods', value: 'Bread & Baked Goods' },
  { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
  { label: 'Fish & Meat', value: 'Fish & Meat' },
  { label: 'Fruit & Veggies', value: 'Fruit & Veggies' },
  { label: 'Grains', value: 'Grains'},
  { label: 'Pasta & Rice', value: 'Pasta & Rice'},
  { label: 'Preserves & Sauces', value: 'Preserves & Sauces' },
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


       <TextInput placeholder="Quantity" style={styles.input} keyboardType="numeric" value={qty} onChangeText={setQty}/>
          

          
       
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
    borderColor: 'orange', 
    marginVertical: 8,   
    padding: 10, 
    fontSize: 18,
    borderRadius: 4     
  },
  
  dropdown: { 
    height: 50, 
    borderWidth: 2, 
    borderColor: 'orange',
    borderRadius: 4,
    marginVertical: 8,  
    paddingHorizontal: 10 
  },
  
  button: { 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 10, 
    borderColor: "orange", 
    borderWidth: 2, 
    alignItems: 'center',
    marginTop: 20  
  },
  buttonText: { 
    color: 'orange', 
    fontWeight: 'bold', 
    fontSize: 18 
  }
});