import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';

export default function RecipeDetails({ route }) {
  const { recipeId } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
      const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        Alert.alert("Error", "Could not load recipe steps.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgba(236, 96, 57, 1)" />
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
        {details?.analyzedInstructions?.steps ? (
          details.analyzedInstructions.steps.map((step) => (
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

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  recipeImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 15 },
  title: { fontFamily: 'NunitoBold', fontSize: 24, color: '#333', marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontFamily: 'NunitoBold', fontSize: 18, color: 'rgba(236, 96, 57, 1)', marginBottom: 10 },
  bulletItem: { fontFamily: 'NunitoMedium', fontSize: 15, color: '#555', marginBottom: 5, lineHeight: 22 },
  stepContainer: { marginBottom: 15 },
  stepNumber: { fontFamily: 'NunitoBold', fontSize: 14, color: '#333', marginBottom: 2 },
  stepText: { fontFamily: 'NunitoMedium', fontSize: 15, color: '#666', lineHeight: 22 },
});