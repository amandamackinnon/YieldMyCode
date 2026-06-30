import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { itemDetailsStyles as styles } from '../Styles/itemDetailsStyles';
import { TILE_COLORS } from '../Styles/fridgeStyles';

export default function ItemDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { itemId } = route.params;
  const { items, decreaseQty, removeItem } = useContext(FridgeContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);
  const isLongPressingRef = useRef(false);
  const touchStartTimeRef = useRef(0);

  const item = items.find((i) => i.id === itemId);


  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item no longer exists.</Text>
      </View>
    );
  }

  const handlePressIn = () => {
    if (timerRef.current) return;

    touchStartTimeRef.current = Date.now();
    isLongPressingRef.current = false;

    timerRef.current = setInterval(() => {
      const freshItem = items.find((i) => i.id === itemId);

      if (freshItem && freshItem.qty > 1) {
        isLongPressingRef.current = true;
        decreaseQty(itemId);
      } else {
        cleanUpTimer();
        triggerDeleteAlert();
      }
    }, 150);
  };

  const handlePressOut = () => {
    const touchDuration = Date.now() - touchStartTimeRef.current;
    cleanUpTimer();

    if (!isLongPressingRef.current && touchDuration < 300) {
      if (item.qty <= 1) {
        triggerDeleteAlert();
      } else {
        decreaseQty(item.id);
      }
    }
  };

  const cleanUpTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerDeleteAlert = () => {
    Alert.alert(
      "Remove Item?",
      `Are you sure you want to remove ${item.name} from the fridge?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeItem(item.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const findRecipes = async () => {
    setLoading(true);
    const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
    const ingredientName = encodeURIComponent(item.name);
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientName}&number=10&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        setRecipes(data);
      } else {
        Alert.alert("No Recipes Found", `Couldn't find any recipes containing ${item.name}.`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch recipes. Check your network link.");
    } finally {
      setLoading(false);
    }
  };

  const getImageSource = () => {
    if (!item.imageUrl || item.imageUrl.trim() === '' || item.imageUrl.includes('no.jpg')) {
      return require('../assets/modal-tile-image.png');
    } return { uri: item.imageUrl };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.headerRow, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>yield</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mainCard}>
        <Image source= {getImageSource()} style={styles.largeImage} resizeMode="contain" />
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <View style={[styles.timelineRow, { flex: 1, borderBottomWidth: 0 }]}>
            <Text style={styles.timelineLabel}>Shopping Date: </Text>
            <Text style={styles.timelineValue}>{item.addedAt || 'Not specified'}</Text>
          </View>

          <View style={[styles.timelineRow, { flex: 1, borderBottomWidth: 0 }]}>
            <Text style={styles.timelineLabel}>Expiry Date: </Text>
            <Text style={[styles.timelineValue, { color: '#EF4E23', fontFamily: 'NunitoBold' }]}>
              {item.expiryDate || 'No date set'}
            </Text>
          </View>

        </View>
      </View>

      <Text style={styles.genText}>Left in the fridge: </Text>

      <View style={styles.counterRow}>
        <Text style={styles.quantityText}>{`${item.qty} ${item.unit || 'pcs'}`}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.counterButton,
            { opacity: pressed ? 0.7 : 1.0 }
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
        
          <Ionicons name="remove-sharp" size={30} color="#FFF" />
        </Pressable>
        <TouchableOpacity style={styles.removeButton} onPress={() => { removeItem(item.id); navigation.goBack(); }}>
          <Ionicons name="trash-outline" size={40} color="#EF4E23" style={{ marginRight: 6 }} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.recipeButton} onPress={findRecipes} disabled={loading}>
        <Text style={styles.recipeButtonText}>
          {loading ? 'Searching...' : `Check Recipes`}
        </Text>
      </TouchableOpacity>

     {recipes.length > 0 && (
        <View style={styles.recipeListContainer}>
          <Text style={styles.recipeSectionTitle}>Recipe Ideas:</Text>
          
          {recipes.map((recipe, index) => {
            const colorsArray = TILE_COLORS || ['#4F6BB7', '#E7B1A6', '#B2DFE8', '#EC6039', '#E7C665', '#699966'];
            
            const cardBgColor = colorsArray[index % colorsArray.length];

            return (
              <TouchableOpacity 
                key={recipe.id} 
                style={[styles.recipeCard, { backgroundColor: cardBgColor }]} 
                onPress={() => navigation.navigate('RecipeDetails', { recipeId: recipe.id })}
              >
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}