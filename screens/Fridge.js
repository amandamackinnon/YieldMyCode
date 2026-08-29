import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, FlatList, Alert, Text, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { categories, getNotificationData } from '../utils/fridgeHelpers';
import { fetchRecipeIdea } from '../services/spoonacular';
import { getDynamicFridgeContent } from '../services/foodContentService';
import FridgeTile from '../components/FridgeTile';
import NotificationModal from '../components/NotificationModal';
import { fridgeStyles as styles } from '../Styles/fridgeStyles';


const sanitizeHTML = (str) => str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');

export default function Fridge({ navigation, route }) {
  const { items } = useContext(FridgeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [previousNotificationState, setPreviousNotificationState] = useState(null);
  const [factTracking, setFactTracking] = useState({});
   const flatListRef = useRef(null);


  const handleFactPress = (ingredientName) => {
    if (!ingredientName) {
      Alert.alert("Oops", "We couldn't verify this ingredient name.");
      return;
    }

    setShowNotifications(false);

    navigation.navigate('FridgeTab', {
      screen: 'FoodTrivia',
      params: {
        ingredient: ingredientName,
        clickId: Date.now()
      }
    });
  };

  const handleRecipePress = async (ingredientName) => {
  if (!ingredientName) return;
  setShowNotifications(false);

  try {
    const randomRecipe = await fetchRecipeIdea(ingredientName);
    navigation.navigate('RecipeDetails', {
      ingredient: ingredientName,
      recipeId: randomRecipe?.id || null,
      autoLoad: true,
      clickId: Date.now()
    });
  } catch (err) {
    console.log("Error during recipe navigation routing:", err);
  }
};

  const toggleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const handleMarkAllOrUndo = () => {
    const allAreRead = notifications.length > 0 && notifications.every(n => n.isRead);
    if (allAreRead && previousNotificationState) {
      setNotifications(previousNotificationState);
      setPreviousNotificationState(null);
    } else {
      setPreviousNotificationState([...notifications]);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };


  useEffect(() => {
    if (!items || items.length === 0) {
      setNotifications([]);
      return;
    }
    const baseline = getNotificationData(items);
    const enhanced = baseline.map((alert) => {
      const cached = notifications.find(n => n.id === alert.id);
      if (cached) return cached;
      const origin = items.find(i => `expire-${i.id}` === alert.id);
      return {
        ...alert,
        text: origin ? `${origin.name} expires soon` : alert.text,
        ingredientName: origin ? origin.name : null,
        isRead: false
      };
    });

    setNotifications(enhanced);
  }, [items]);

  useEffect(() => {
    if (route.params?.toggleNotifications) {
      setShowNotifications(prev => !prev);
      navigation.setParams({ toggleNotifications: undefined });
    }
  }, [route.params?.toggleNotifications]);

  const [fontsLoaded] = useFonts({
    NunitoRegular: Nunito_400Regular, NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold, NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  const filteredInventory = items.filter(i => selectedCategory === 'All' || i.category === selectedCategory);

  return (
    <View style={styles.container}>
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onToggleRead={toggleMarkAsRead}
        onMarkAllOrUndo={handleMarkAllOrUndo}
        onFactPress={handleFactPress}
        onRecipePress={handleRecipePress}
      />

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={{ fontSize: 1, color: 'transparent' }}
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        renderLeftIcon={() => <Ionicons name="search" size={25} color="grey" style={{ marginRight: 10 }} />}
        renderRightIcon={() => <View style={{ width: 0, height: 0 }} />}
        
      />

      <FlatList
        ref={flatListRef} 
        data={filteredInventory}
        renderItem={({ item, index }) => <FridgeTile item={item} index={index} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true} 
        indicatorStyle="black"     
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 1 }}
        contentContainerStyle={{ 
          width: '100%',
          paddingRight: 5,
          paddingLeft: 5,
        }}
         onLayout={() => {
          setTimeout(() => {
            flatListRef.current?.flashScrollIndicators();
          }, 200); 
        }}

        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Image source={require('../assets/modal-tile-image.png')} style={{ width: 200, height: 200, marginBottom: 20, opacity: 0.8 }} resizeMode="contain" />
            <Text style={{
              fontSize: 18,
              fontFamily: 'NunitoSemiBold',
              color: '#666',
              textAlign: 'center'
            }}>  No items from category {selectedCategory === 'All' ? '' : `${selectedCategory} `} in your fridge</Text>
          </View>
        )}
      />

    </View>
  );
}