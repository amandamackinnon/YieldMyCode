import 'react-native-gesture-handler';
import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import TabBarIcon from './components/icons/TabBarIcon';
import Fridge from './screens/Fridge';
import AddToFridge from './screens/AddToFridge';
import Profile from './screens/Profile';
import Shopping from './screens/Shopping';
import { FridgeProvider } from './context/FridgeContext';
import ItemDetails from './screens/ItemDetails';
import RecipeDetails from './screens/RecipeDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function FridgeStack({ inventory, deleteItem, decreaseQty, setInventory }) {
  return (
    <FridgeProvider>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={{ marginRight: 16 }}>

              <Ionicons name="notifications" size={32} color="rgba(236, 96, 57, 1)" />
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                }} />

            </TouchableOpacity>
          ),
        })}>

        <Stack.Screen name="FridgeHome" options={{
          title: 'yield',
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 32, fontFamily: 'NunitoSemiBold' }
        }}>
          {(props) => (
            <Fridge
              {...props}
              inventory={inventory}
              onDeleteItem={deleteItem}
              onDecreaseQty={decreaseQty} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddToFridge"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }} >

          {(props) => (
            <AddToFridge
              {...props}
              onAddProduct={(newItem) => setInventory([...inventory, newItem])} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="ItemDetails"
          component={ItemDetails}
          options={{
            title: 'yield',
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: 'NunitoSemiBold', fontSize: 32 },
          }} />

        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetails}
          options={{
            title: 'Recipe Cooking Guide',
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: 'NunitoSemiBold', fontSize: 20 }
          }}
        />

      </Stack.Navigator>
    </FridgeProvider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

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
          tabBarIcon: ({ focused }) => {
            const config = {
              Profile: { name: 'profile', label: 'Profile' },
              FridgeTab: { name: 'fridge', label: 'Fridge' },
              Shopping: { name: 'shopping', label: 'Shopping' },
              Add: { name: 'add', label: 'Add' },
            };
            const { name, label } = config[route.name];
            return <TabBarIcon name={name} label={label} focused={focused} />;
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 55,
            paddingBottom: 4,
            paddingTop: 2,
            borderTopWidth: 1,
            backgroundColor: '#ffffff',
          },
          tabBarItemStyle: {
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