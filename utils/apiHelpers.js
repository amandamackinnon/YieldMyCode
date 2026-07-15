import { Alert } from 'react-native';

export const fetchRecipesForIngredient = async (ingredientName, setLoading) => {
  setLoading(true);
  const apiKey = 'e7de26d39bf344c88aaf33e8ee08eda4';
  const encodedName = encodeURIComponent(ingredientName);
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodedName}&number=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return data;
    } else {
      Alert.alert("No Recipes Found", `Couldn't find any recipes containing ${ingredientName}.`);
      return [];
    }
  } catch (error) {
    Alert.alert("Error", "Could not fetch recipes. Check your network link.");
    return [];
  } finally {
    setLoading(false);
  }
};