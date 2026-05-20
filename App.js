import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';
import Fridge from './screens/Fridge';
import AddToFridge from './screens/AddToFridge';
import Profile from './screens/Profile'; 
import Shopping from './screens/Shopping'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function FridgeStack({ inventory, deleteItem, decreaseQty, setInventory }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FridgeHome" options={{ title: 'yield' }}>
        {(props) => (
          <Fridge 
            {...props} 
            inventory={inventory} 
            onDeleteItem={deleteItem} 
            onDecreaseQty={decreaseQty}
          />
        )}
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
  );
}


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
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline'; //placeholder icon
            } else if (route.name === 'FridgeTab') {
              iconName = focused ? 'fast-food' : 'fast-food-outline'; //placeholder icon
            } else if (route.name === 'Shopping') {
              iconName = focused ? 'basket' : 'basket-outline'; //placeholder icon
            } else if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline'; //placeholder icon
            }

            return <Ionicons name={iconName} size={size + 2} color={color} />;
          },
          tabBarActiveTintColor: 'rgba(236, 96, 57, 1)',   
          tabBarInactiveTintColor: 'rgba(246, 202, 94, 1)',
          headerShown: false,                
          tabBarStyle: {
            height: 80,
            paddingBottom: 20,
            marginBottom: 40,// the icons were too close to the bottom of the screen. Not sure if this is the proper fix or not
            paddingTop: 10,
            borderTopWidth: 1,
            backgroundColor: '#ffffff'
          }
        })}
      >
        
        <Tab.Screen name="Profile" component={Profile} />

        <Tab.Screen name="FridgeTab" options={{ title: 'Fridge' }}>
          {() => (
            <FridgeStack 
              inventory={inventory} 
              deleteItem={deleteItem} 
              decreaseQty={decreaseQty} 
              setInventory={setInventory}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Shopping" component={Shopping} />
        
       <Tab.Screen 
  name="Add" 
  component={View}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      e.preventDefault(); 
      navigation.navigate('FridgeTab', { screen: 'AddToFridge' });
    },
  })}
/>

      </Tab.Navigator>
      
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}