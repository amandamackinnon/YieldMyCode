import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Fridge from './screens/Fridge';
import AddToFridge from './screens/AddToFridge';
import React, { useState } from 'react';

const Stack = createStackNavigator();

export default function App() {
  const [inventory, setInventory] = useState([]);

  const deleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const decreaseQty = (id) => {
  setInventory(inventory.map(item => {
    if (item.id === id) {
      return { ...item, qty: Math.max(1, item.qty - 1) };
    }
    return item;
  }));
};
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Fridge">
        
        <Stack.Screen name="Fridge">
          {(props) => (<Fridge {...props} inventory={inventory} onDeleteItem={deleteItem} onDecreaseQty={decreaseQty}/>)}
        </Stack.Screen>

        <Stack.Screen name="AddToFridge" options={{ title: 'Add to Fridge' }}>
          {(props) => (
            <AddToFridge 
              {...props} 
              onAddProduct={(newItem) => setInventory([...inventory, newItem])}
            />
          )}    
        </Stack.Screen>

      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}