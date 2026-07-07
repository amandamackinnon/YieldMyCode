import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Platform, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FridgeContext } from '../context/FridgeContext';
import { categories, getNotificationData } from '../utils/fridgeHelpers';
import { fetchRecipeIdea } from '../services/spoonacular';
import { getDynamicFridgeContent } from '../services/foodContentService';
import FridgeTile from '../components/FridgeTile';
import { fridgeStyles as styles } from '../Styles/fridgeStyles';


export default function Fridge({ navigation, route }) {
  const { items, removeItem, decreaseQty } = useContext(FridgeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState([]);

const handleFactPress = async (ingredientName) => {
  if (!ingredientName) {
    Alert.alert("Oops", "We couldn't verify this ingredient name.");
    return;
  }
  
  try {
    
    const activeFridgeNames = items ? items.map(i => i.name) : [];
    
    
    const content = await getDynamicFridgeContent(activeFridgeNames, ingredientName); 
    

    if (content.type === 'fact') {
      Alert.alert(
        `${ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} Insight`, 
        content.text, 
        [{ text: "The more you know!", style: "cancel" }]
      );
    } 

    else if (content.type === 'quiz') {
      const sanitize = (str) => str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
      
      const cleanQuestion = sanitize(content.question);
      const cleanCorrect = sanitize(content.correctAnswer);
      
      const choicePool = [content.correctAnswer, ...content.incorrectAnswers]
        .map(ans => sanitize(ans))
        .sort(() => Math.random() - 0.5);

  
      const alertButtons = choicePool.map(choice => ({
        text: choice,
        onPress: () => {
          if (choice === cleanCorrect) {
            Alert.alert("🎉 Correct!", "You really know your food facts!", [{ text: "Now you're cooking!" }]);
          } else {
            Alert.alert("❌ Not Quite", `Good try! The correct answer was actually: ${cleanCorrect}`, [{ text: "Food for thought!" }]);
          }
        }
      }));

      if (alertButtons.length > 3) alertButtons.splice(3);

      Alert.alert(
        "🍎 Daily Kitchen Quiz",
        cleanQuestion,
        alertButtons,
        { cancelable: true }
      );
    }
  } catch (err) {
    Alert.alert("Error", "Could not load food content at this moment.");
  }
};

const handleRecipePress = async (ingredientName) => {
  if (!ingredientName) return;

  setShowNotifications(false);

  try {
    const randomRecipe = await fetchRecipeIdea(ingredientName);
    
    if (randomRecipe && randomRecipe.id) {
      navigation.navigate('RecipeDetails', { 
        ingredient: ingredientName,
        recipeId: randomRecipe.id, 
        autoLoad: true,
        clickId: Date.now() 
      });
    } else {
      navigation.navigate('RecipeDetails', { ingredient: ingredientName, autoLoad: true });
    }
  } catch (err) {
    console.log("Error during recipe navigation routing:", err);
  }
};

  const [previousNotificationState, setPreviousNotificationState] = useState(null);
  const flatListRef = useRef(null);

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
  const syncAlerts = () => {
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
        text: origin ? `${origin.name} expires soon!` : alert.text,
        ingredientName: origin ? origin.name : null,
        isRead: false 
      };
    });

    setNotifications(enhanced);
  };
  syncAlerts();
}, [items]);

  useEffect(() => {
    if (showNotifications) {
      setTimeout(() => flatListRef.current?.flashScrollIndicators(), 150);
    }
  }, [showNotifications]);

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
  
  const allRead = notifications.length > 0 && notifications.every(n => n.isRead);

  return (
    <View style={styles.container}>
      <Modal visible={showNotifications} transparent animationType="fade">
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowNotifications(false)}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
          )}
        </TouchableOpacity>

        <View style={styles.notificationDropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Notifications</Text>
            
            <TouchableOpacity onPress={handleMarkAllOrUndo}>
              <Text style={styles.markAsRead}>
                {allRead && previousNotificationState ? "Undo Mark All" : "Mark all as read"}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={notifications}
            keyExtractor={item => item.id}
            persistentScrollbar
            showsVerticalScrollIndicator
           renderItem={({ item }) => (
    <View style={styles.notificationContainerCell}>
      <View style={styles.notificationItem}>
        <TouchableOpacity onPress={() => toggleMarkAsRead(item.id)}>
          <View style={[styles.indicatorDot, { backgroundColor: item.isRead ? '#FFFFFF' : '#E07A5F', borderColor: '#E07A5F' }]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleMarkAsRead(item.id)}>
          <Text style={[styles.notificationText, { color: item.isRead ? '#999999' : '#2D3142', fontFamily: item.isRead ? 'NunitoRegular' : 'NunitoMedium' }]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>

      {item.ingredientName && !item.isRead && (
        <View style={styles.actionLinksContainer}>
         <TouchableOpacity 
      onPress={() => handleFactPress(item.ingredientName)} 
      style={styles.linkTouchTarget}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
    >
      <Text style={styles.actionLinkText}>Would you like some food trivia?</Text>
    </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleRecipePress(item.ingredientName)} 
            style={styles.linkTouchTarget}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionLinkText}>Would you like to see a recipe?</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
            )}
          />
        </View>
      </Modal>
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
        data={filteredInventory}
        renderItem={({ item, index }) => <FridgeTile item={item} index={index} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}
