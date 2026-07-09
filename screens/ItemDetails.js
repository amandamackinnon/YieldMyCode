import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { itemDetailsStyles as styles } from '../Styles/itemDetailsStyles';
import { TILE_COLORS } from '../Styles/fridgeStyles';

export default function ItemDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { itemId } = route.params;
  const { items, decreaseQty, consumeItem, wasteItem } = useContext(FridgeContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputAmount, setInputAmount] = useState('');

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item no longer exists.</Text>
      </View>
    );
  }

  const triggerDeleteAlert = () => {
    Alert.alert(
      "Remove Item?",
      `Did you eat ${item.name} or was it wasted?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "🗑️ Wasted",
          style: "destructive",
          onPress: () => {
            wasteItem(item.id); 
            navigation.goBack();
          }
        },
        {
          text: "🎉 Eaten",
          onPress: () => {
            consumeItem(item.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const openDecrementModal = () => {
    setInputAmount(Math.ceil(item.qty / 2).toString()); 
    setIsModalVisible(true);
  };

  const handlePartialAction = (actionType) => {
    const amount = Number(inputAmount);
    if (amount > 0 && amount <= item.qty) {
      decreaseQty(item.id, amount, actionType);
      setIsModalVisible(false);
      if (amount === item.qty) navigation.goBack();
    } else {
      Alert.alert("Invalid Amount", `Please enter a quantity between 1 and ${item.qty}.`);
    }
  };

  const findRecipes = async () => {
    setLoading(true);
    const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
    const ingredientName = encodeURIComponent(item.name);
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientName}&number=20&apiKey=${apiKey}`;

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
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView style={styles.container}>
        <View style={[styles.headerRow, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>yield</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.mainCard}>
          <Image source={getImageSource()} style={styles.largeImage} resizeMode="contain" />
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
          <Text style={styles.quantityText}>
            {item.qty} {item.unit || 'pcs'}
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.counterButton,
              { opacity: pressed ? 0.7 : 1.0 }
            ]}
            onPress={openDecrementModal}
          >
            <Ionicons name="remove-sharp" size={30} color="#FFF" />
          </Pressable>

          <TouchableOpacity style={styles.removeButton} onPress={triggerDeleteAlert}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalSubtitle}>
              How many {item.unit || 'pcs'} are you removing? (Max: {item.qty})
            </Text>
            
            <TextInput
              style={styles.numericInput}
              keyboardType="numeric"
              value={inputAmount}
              onChangeText={setInputAmount}
              selectTextOnFocus
              autoFocus
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelBtn]} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.wasteBtn]} 
                onPress={() => handlePartialAction('wasted')}
              >
                <Text style={styles.actionBtnText}>🗑️ Wasted</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.eatenBtn]} 
                onPress={() => handlePartialAction('consumed')}
              >
                <Text style={styles.actionBtnText}>🎉 Eaten</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

