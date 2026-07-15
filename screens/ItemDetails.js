import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { itemDetailsStyles as styles } from '../Styles/itemDetailsStyles';
import { TILE_COLORS } from '../Styles/fridgeStyles';
import CustomDeleteModal from '../components/CustomDeleteModal';
import DecrementModal from '../components/DecrementModal';
import { fetchRecipesForIngredient } from '../utils/apiHelpers';

export default function ItemDetails({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { itemId } = route.params;
  const { items, decreaseQty, consumeItem, wasteItem } = useContext(FridgeContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); 

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item no longer exists.</Text>
      </View>
    );
  }

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
    const data = await fetchRecipesForIngredient(item.name, setLoading);
    if (data.length > 0) setRecipes(data);
  };

  const navigateToTrivia = () => {
    navigation.navigate('FridgeTab', {
      screen: 'FoodTrivia',
      params: { ingredient: item.name, clickId: Date.now() },
      initialRouteName: 'FridgeHome'
    });
  };

  const getImageSource = () => {
    if (!item.imageUrl || item.imageUrl.trim() === '' || item.imageUrl.includes('no.jpg')) {
      return require('../assets/modal-tile-image.png');
    }
    return { uri: item.imageUrl };
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView style={styles.container}>

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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: -15 }}>
            <Text style={styles.quantityText}>
              {item.qty} {item.unit || 'pcs'}
            </Text>

            <Pressable 
              style={({ pressed }) => [styles.counterButton, { opacity: pressed ? 0.7 : 1.0 }]}
              onPress={openDecrementModal}
            >
              <Ionicons name="remove-sharp" size={30} color="#FFF" />
            </Pressable>

            <TouchableOpacity style={styles.removeButton} onPress={() => setDeleteModalVisible(true)}>
              <Ionicons name="trash-outline" size={35} color="#EF4E23" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'column', gap: 8, width: 160, alignItems: 'stretch' }}>
            <TouchableOpacity style={[styles.triviaButton, { marginTop: 0, marginBottom: -2,  width: '100%' }]} onPress={navigateToTrivia} disabled={loading}>
              <Text style={styles.triviaButtonText}>Food Trivia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.recipeButton, { marginTop: 0, width: '100%' }]} onPress={findRecipes} disabled={loading}>
              <Text style={styles.recipeButtonText}>
                {loading ? 'Searching...' : `Check Recipes`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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

      <DecrementModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        unit={item.unit}
        maxQty={item.qty}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        onAction={handlePartialAction}
      />

      <CustomDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onWaste={() => {
          setDeleteModalVisible(false);
          wasteItem(item.id);
          navigation.goBack();
        }}
        onConsume={() => {
          setDeleteModalVisible(false);
          consumeItem(item.id);
          navigation.goBack();
        }}
      />
    </View>
  );
}