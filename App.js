import 'react-native-gesture-handler';
import React, { useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import TabBarIcon from './components/icons/TabBarIcon';
import Fridge from './screens/Fridge';
import AddToFridge from './screens/AddToFridge';
import Profile from './screens/Profile';
import { FridgeProvider, FridgeContext } from './context/FridgeContext';
import ItemDetails from './screens/ItemDetails';
import RecipeDetails from './screens/RecipeDetails';
import NotificationModal from './components/NotificationModal';
import FoodTriviaScreen from './screens/FoodTriviaScreen';

const NotificationModalContext = createContext();
export const useNotificationModal = () => useContext(NotificationModalContext);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const navigationRef = React.createRef();

function FridgeStack() {
  const { showNotifications } = useNotificationModal();
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            onPress={showNotifications}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="notifications" size={32} color="rgba(236, 96, 57, 1)" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="FridgeHome"
        component={Fridge}
        options={{
          title: 'yield',
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 32, fontFamily: 'NunitoSemiBold' },
          headerRight: () => (
            <TouchableOpacity
              onPress={showNotifications}
              style={{ marginRight: 20 }}
            >
              <Ionicons name="notifications" size={28} color="#E07A5F" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="AddToFridge"
        component={AddToFridge}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={{
          title: 'yield',
          headerBackTitle: '',
          headerTintColor: 'black',
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 32, fontFamily: 'NunitoSemiBold' },
        }}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{
          title: 'Recipe',
          headerBackTitle: 'Back',
          headerTintColor: 'black',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'NunitoSemiBold', fontSize: 30 }
        }}
      />

      <Stack.Screen
        name="FoodTrivia"
        component={FoodTriviaScreen}
        options={{
          title: 'Food Trivia',
          headerBackTitle: 'Back',
          headerTintColor: 'black',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'NunitoSemiBold', fontSize: 30 }
        }}
      />
    </Stack.Navigator>
  );
}

function MainAppContent() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState([]); 
  const contextData = useContext(FridgeContext) || {};
  const itemsArray = Array.isArray(contextData)
    ? contextData
    : (contextData.items || contextData.fridgeItems || []);

  
  const notifications = itemsArray
    .filter(item => {
      const rawDate = item.expiryDate || item.expiry || item.expirationDate;
      if (!rawDate || typeof rawDate !== 'string') return false;

      const parts = rawDate.split('/');
      if (parts.length !== 3) return false;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const expiry = new Date(year, month, day);
      const today = new Date();

      expiry.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return daysLeft >= 0 && daysLeft <= 3;
    })
    .map(item => {
      const finalName = item.name || item.itemName || 'Unknown Item';
      return {
        id: item.id || Math.random().toString(),
        text: `${finalName} is expiring soon!`,
        isRead: readNotificationIds.includes(item.id),
        ingredientName: finalName
      };
    });

  const handleToggleRead = (id) => {
    setReadNotificationIds(prev =>
      prev.includes(id) ? prev.filter(itemRef => itemRef !== id) : [...prev, id]
    );
  };

  const handleMarkAllOrUndo = () => {
    const allIds = notifications.map(n => n.id);
    const areAllRead = allIds.every(id => readNotificationIds.includes(id));
    if (areAllRead) {
      setReadNotificationIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setReadNotificationIds(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const safeBottomPadding = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 14 : 10);
  const totalTabBarHeight = insets.bottom > 0 ? 60 + insets.bottom : 76;

  return (
    <NotificationModalContext.Provider value={{ showNotifications: () => setModalVisible(true) }}>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
              const config = {
                Profile: { name: 'profile', label: 'Profile' },
                FridgeTab: { name: 'fridge', label: 'Fridge' },
                Add: { name: 'add', label: 'Add' },
              };
              const { name, label } = config[route.name];
              return <TabBarIcon name={name} label={label} focused={focused} />;
            },
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
              height: totalTabBarHeight,
              paddingBottom: safeBottomPadding,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              backgroundColor: '#ffffff',
            },
            tabBarItemStyle: { paddingHorizontal: 0 },
          })}
        >
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              title: 'yield',
              headerShadowVisible: false,
              headerTitleAlign: 'left',
              headerTitleStyle: { fontSize: 32, fontFamily: 'NunitoSemiBold' },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)} 
                  style={{ marginRight: 20 }}
                >
                  <Ionicons name="notifications" size={28} color="#E07A5F" />
                </TouchableOpacity>
              ),
            }}
          />

          <Tab.Screen
            name="FridgeTab"
            component={FridgeStack}
            options={{ title: 'Fridge' }}
          />

          <Tab.Screen
            name="Add"
            component={View}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate('FridgeTab');
                setTimeout(() => {
                  navigation.navigate('FridgeTab', { screen: 'AddToFridge' });
                }, 50);
              },
            })}
          />
        </Tab.Navigator>

        <NotificationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          notifications={notifications}
          onToggleRead={handleToggleRead}
          onMarkAllOrUndo={handleMarkAllOrUndo}
          onFactPress={(ingredientName) => {
            setModalVisible(false);
            navigationRef.current?.navigate('FridgeTab', {
              screen: 'FoodTrivia',
              params: {
                ingredient: ingredientName,
                clickId: Date.now()
              },
              initialRouteName: 'FridgeHome' 
            });
          }}
          onFactPress={(ingredientName) => {
            setModalVisible(false);

            navigationRef.current?.navigate('FridgeTab', {
              screen: 'FoodTrivia',
              params: {
                ingredient: ingredientName,
                clickId: Date.now()
              },
      
              initialRouteName: 'FridgeHome' 
            });
          }}
          onRecipePress={(ingredientName) => {
            setModalVisible(false);

            navigationRef.current?.navigate('FridgeTab', {
              screen: 'RecipeDetails',
              params: {
                ingredient: ingredientName,
                recipeId: null, 
                clickId: Date.now()
              },
              initialRouteName: 'FridgeHome' 
            });
          }}

            onRecipePress={(ingredientName) => {
            setModalVisible(false);
            navigationRef.current?.navigate('FridgeTab', { screen: 'FridgeHome' });

            const randomOffset = Math.floor(Math.random() * 10);

            setTimeout(() => {
              navigationRef.current?.navigate('FridgeTab', {
                screen: 'RecipeDetails',
                params: {
                  ingredient: ingredientName,
                  recipeId: null,
                  clickId: Date.now(),
                  offset: randomOffset
                }
              });
            }, 50);
          }}
        />

        <StatusBar style="auto" />
      </NavigationContainer>
    </NotificationModalContext.Provider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <FridgeProvider>
        <MainAppContent />
      </FridgeProvider>
    </SafeAreaProvider>
  );
}