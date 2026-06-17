import React, { useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        Alert.alert("No Recipes Found", `Couldn't find any recipes starring ${item.name}.`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch recipes. Check your network link.");
    } finally {
      setLoading(false);
    }
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
        <Image source={{ uri: item.imageUrl }} style={styles.largeImage} resizeMode="contain" />
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
          onPressOut={handlePressOut}
        >
          <Ionicons name="remove-sharp" size={30} color="#FFF" />
        </Pressable>
         <TouchableOpacity style={styles.removeButton} onPress={() => {removeItem(item.id); navigation.goBack();}}>
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
          {recipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetails', { recipeId: recipe.id })} >
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 50,
    paddingBottom: 60,
  },
  mainCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderColor: '#fff',
  },
  largeImage: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'NunitoMedium',
  },
  genText: {
    marginTop: 35,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -15,

  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontFamily: 'NunitoMedium',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 20,
    gap: 30,
    marginLeft: -15,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E7B1A6',
    backgroundColor: '#E7B1A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
  },

  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },

  recipeButton: {
    flexDirection: 'row',
    backgroundColor: '#F6CA5E',
    paddingVertical: 12,
    borderRadius: 4,
    borderColor: '#292929',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    marginVertical: 15,
    marginLeft: -12,
  
  },
  recipeButtonText: {
    color: '#292929',
    fontFamily: 'NunitoMedium',
    fontSize: 15,
  },

  recipeListContainer: {
    width: '85%',
    marginTop: 15,
    marginBottom: 30,
  },
  recipeSectionTitle: {
    fontFamily: 'NunitoBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  recipeImage: {
    width: 75,
    height: 75,
    backgroundColor: '#e1e1e1',
  },
  recipeInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontFamily: 'NunitoBold',
    fontSize: 14,
    color: '#333',
  },
  recipeMatchText: {
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  removeButtonText: {
    color: "#EF4E23",
    fontFamily: 'NunitoBold',
    fontSize: 20  ,

  },
  headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingBottom: 10,
  backgroundColor: '#fff',
},
backButton: {
  width: 40,
  alignItems: 'flex-start',
},
headerTitle: {
  fontSize: 32,
  fontFamily: 'NunitoSemiBold',
  color: '#000',
  textAlign: 'center',
  flex: 1,
},
headerSpacer: {
  width: 40, 
},

});