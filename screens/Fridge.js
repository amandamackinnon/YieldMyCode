import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
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


  const handleFactPress = async (ingredientName) => {
    if (!ingredientName) {
      Alert.alert("Oops", "We couldn't verify this ingredient name.");
      return;
    }
    
    const lookupKey = ingredientName.trim().toLowerCase();
    const currentIdx = factTracking[lookupKey] || 0;

    try {
      const activeFridgeNames = items ? items.map(i => i.name) : [];
      const content = await getDynamicFridgeContent(activeFridgeNames, ingredientName, currentIdx); 

      if (content.type === 'fact') {
        Alert.alert(
          `${ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} Insight`, 
          content.text, 
          [{ 
            text: `The more you know!`, 
            style: "cancel",
            onPress: () => setFactTracking(prev => ({ ...prev, [lookupKey]: currentIdx + 1 }))
          }]
        );
      } else if (content.type === 'quiz') {
        const cleanQuestion = sanitizeHTML(content.question);
        const cleanCorrect = sanitizeHTML(content.correctAnswer);
        const choicePool = [content.correctAnswer, ...content.incorrectAnswers]
          .map(ans => sanitizeHTML(ans))
          .sort(() => Math.random() - 0.5);

        const alertButtons = choicePool.map(choice => ({
          text: choice,
          onPress: () => {
            if (choice === cleanCorrect) {
              Alert.alert("🎉 Correct!", "You really know your food facts!", [{ text: "Now you're cooking!" }]);
            } else {
              Alert.alert("❌ Not Quite", `Good try! The correct answer was: ${cleanCorrect}`, [{ text: "Food for thought!" }]);
            }
          }
        }));

        if (alertButtons.length > 3) alertButtons.splice(3);
        Alert.alert("🍎 Daily Kitchen Quiz", cleanQuestion, alertButtons, { cancelable: true });
      }
    } catch (err) {
      Alert.alert("Error", "Could not load food content at this moment.");
    }
  };

  // 🍳 Recipe Suggestions Routing Handler
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
        text: origin ? `${origin.name} expires soon!` : alert.text,
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
        data={filteredInventory}
        renderItem={({ item, index }) => <FridgeTile item={item} index={index} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}