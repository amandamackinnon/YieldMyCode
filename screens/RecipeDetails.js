import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { fetchRecipeIdea } from '../services/spoonacular';
import { recipeDetailsStyles as styles } from '../Styles/recipeDetailsStyles';

export default function RecipeDetails({ route, navigation }) {
  
  const { ingredient, recipeId: initialRecipeId } = route.params || {};  
  const [recipeId, setRecipeId] = useState(initialRecipeId);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (route.params?.recipeId) {
      setRecipeId(route.params.recipeId);
    }
  }, [route.params?.clickId, route.params?.recipeId]); 

  useEffect(() => {
    const handleIncomingParams = async () => {

      if (!recipeId && ingredient) {
  setLoading(true);
  try {
    const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
    const cleanName = encodeURIComponent(ingredient.trim().toLowerCase());
    
    const searchResponse = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${cleanName}&number=50&apiKey=${apiKey}`
    );
    
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      if (searchResults && searchResults.length > 0) {
    
        const randomIndex = Math.floor(Math.random() * searchResults.length);
        
        setRecipeId(searchResults[randomIndex].id);
        return; 
      }
    }
  } catch (err) {
    console.log("Error in fallback lookup:", err);
  }
}

      if (recipeId) {
        setLoading(true);
        try {
          const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
          const detailsResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
          );
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            setDetails(detailsData);
          }
        } catch (err) {
          console.log("Error fetching details data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    handleIncomingParams();
  }, [recipeId, ingredient]); 

  useEffect(() => {
    if (route.params?.toggleNotifications) {
      navigation.popToTop();
      navigation.navigate({
        merge: true, 
        params: { toggleNotifications: route.params.toggleNotifications },
      });
    }
  }, [route.params?.toggleNotifications]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgba(236, 96, 57, 1)" />
        {ingredient && !recipeId && (
          <Text style={styles.loadingText}>Finding recipes using {ingredient}...</Text>
        )}
      </View>
    );
  }
  
  if (!details) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No recipe details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: details?.image }} style={styles.recipeImage} />
      <Text style={styles.title}>{details?.title}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients Needed:</Text>
        {details?.extendedIngredients?.map((ing, index) => (
          <Text key={index} style={styles.bulletItem}>
            • {ing.original}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        {details?.analyzedInstructions?.[0]?.steps ? (
          details.analyzedInstructions[0].steps.map((step) => (
            <View key={step.number} style={styles.stepContainer}>
              <Text style={styles.stepNumber}>Step {step.number}</Text>
              <Text style={styles.stepText}>{step.step}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.stepText}>
            {details?.instructions?.replace(/<[^>]*>/g, '') || "No detailed instructions provided."}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}


