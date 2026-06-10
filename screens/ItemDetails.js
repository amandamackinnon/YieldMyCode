import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FridgeContext } from '../context/FridgeContext';

export default function ItemDetails({ route, navigation }) {
  const { itemId } = route.params;
  const { items, decreaseQty, removeItem } = useContext(FridgeContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item no longer exists.</Text>
      </View>
    );
  }

  const findRecipes = async () => {
    setLoading(true);
    const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4'; 
    const ingredientName = encodeURIComponent(item.name);
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientName}&number=10&apiKey=${apiKey}`; //this is where I can set the number of recipes generated


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
      <View style={styles.mainCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.largeImage} resizeMode="contain" />
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View style={styles.timelineRow}>
          <Ionicons name="calendar-outline" size={20} color="#555" style={styles.timelineIcon} />
          <View>
            <Text style={styles.timelineLabel}>Added to Fridge</Text>
            <Text style={styles.timelineValue}>{item.addedAt || 'Not specified'}</Text>
          </View>
        </View>

        <View style={[styles.timelineRow, { borderBottomWidth: 0 }]}>
          <Ionicons name="time-outline" size={20} color="#EF4E23" style={styles.timelineIcon} />
          <View>
            <Text style={styles.timelineLabel}>Expiration Date</Text>
            <Text style={[styles.timelineValue, { color: '#EF4E23', fontFamily: 'NunitoBold' }]}>
              {item.expiryDate || 'No date set'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.genText}>Left in the fridge: </Text>

      <View style={styles.counterRow}>
        
        <Text style={styles.quantityText}>{item.qty}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => decreaseQty(item.id)}>
          <Ionicons name="remove-sharp" size={50} color="#FFF"/>
        </TouchableOpacity>

      </View>

        <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => {
          removeItem(item.id);
          navigation.goBack(); 
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4E23" style={{ marginRight: 5}} />
        <Text style={styles.removeButtonText}>Remove Item from Fridge</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.recipeButton} 
        onPress={findRecipes}
        disabled={loading}
      >

        
        <Ionicons name="restaurant-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.recipeButtonText}>
          {loading ? 'Searching...' : `Find Recipes with ${item.name}`}
        </Text>
      </TouchableOpacity>

      {recipes.length > 0 && (
        <View style={styles.recipeListContainer}>
          <Text style={styles.recipeSectionTitle}>Recipe Ideas:</Text>
          {recipes.map((recipe) => (
            <TouchableOpacity 
            key={recipe.id} 
            style={styles.recipeCard}
            onPress ={()=>navigation.navigate('RecipeDetails', { recipeId: recipe.id })}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                <Text style={styles.recipeMatchText}>
                  Uses {recipe.usedIngredientCount} of your ingredients
                </Text>
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
    paddingTop: 40,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
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
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 40,
  },
  counterButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E7B1A6',
    backgroundColor: '#E7B1A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#333',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: 'auto',
    marginBottom: 40,
    padding: 12,
    
  },
  removeButtonText: {
    color: '#EF4E23',
    fontSize: 15,
    fontWeight: '600',
    
},
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },

  recipeButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(236, 96, 57, 1)', 
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    marginVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  recipeButtonText: {
    color: '#fff',
    fontFamily: 'NunitoBold',
    fontSize: 16,
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
});