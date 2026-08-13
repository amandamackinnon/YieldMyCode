
import React, { useState, createContext, useContext, useMemo } from 'react';
import { TouchableOpacity, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { getNotificationData } from '../utils/fridgeHelpers';
import TabBarIcon from '../components/icons/TabBarIcon';
import NotificationModal from '../components/NotificationModal';
import Fridge from '../screens/Fridge';
import AddToFridge from '../screens/AddToFridge';
import Profile from '../screens/Profile';
import ItemDetails from '../screens/ItemDetails';
import RecipeDetails from '../screens/RecipeDetails';
import FoodTriviaScreen from '../screens/FoodTriviaScreen';


const NotificationModalContext = createContext();
export const useNotificationModal = () => useContext(NotificationModalContext);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = React.createRef();

function FridgeStack() {
  const { showNotifications } = useNotificationModal();
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => (
          <TouchableOpacity onPress={showNotifications} style={{ marginRight: 20 }}>
            <Ionicons name="notifications" size={28} color="#E07A5F" />
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

export default function AppNavigator() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState([]); 
  
  const contextData = useContext(FridgeContext) || {};
  const itemsArray = Array.isArray(contextData)
    ? contextData
    : (contextData.items || contextData.fridgeItems || []);

  const notifications = useMemo(() => {
    return getNotificationData(itemsArray, readNotificationIds);
  }, [itemsArray, readNotificationIds]);

  const handleToggleRead = (id) => {
    setReadNotificationIds(prev =>
      prev.includes(id) ? prev.filter(itemRef => itemRef !== id) : [...prev, id]
    );
  };

  const handleMarkAllOrUndo = () => {
    const allIds = notifications.map(n => n.id);
    const areAllRead = allIds.every(id => readNotificationIds.includes(id));
    setReadNotificationIds(areAllRead ? [] : allIds);
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
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 20 }}>
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
      </NavigationContainer>
    </NotificationModalContext.Provider>
  );
}