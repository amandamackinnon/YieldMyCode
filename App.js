import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from './components/icons/TabBarIcon';
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
          tabBarIcon: ({ focused }) => {   // ← REPLACED: removed color, size params
            const config = {
              Profile: { name: 'profile', label: 'Profile' },
              FridgeTab: { name: 'fridge', label: 'Fridge' },
              Shopping: { name: 'shopping', label: 'Shopping' },
              Add: { name: 'add', label: 'Add' },
            };
            const { name, label } = config[route.name];
            return <TabBarIcon name={name} label={label} focused={focused} />;
          },
          tabBarShowLabel: false,           // ← NEW: hide default labels (we render our own)
          headerShown: false,
 tabBarStyle: {
  height: 55,           // ← REDUCED from 60
  paddingBottom: 4,     // ← REDUCED from 6
  paddingTop: 2,        // ← REDUCED from 4
  borderTopWidth: 1,
  backgroundColor: '#ffffff',
},
tabBarItemStyle: {      // ← ADD this new property
  paddingHorizontal: 0,
},
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