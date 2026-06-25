import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchFoodTrivia = async (ingredientName) => {
  try {
    // Pass the specific item name to pull contextual trivia rather than a random fact
    const response = await fetch(`https://api.example.com/food/trivia?query=${encodeURIComponent(ingredientName)}`);
    const data = await response.json();
    return data.text || `Did you know you can preserve ${ingredientName} by freezing it?`;
  } catch {
    return `Make sure to use your ${ingredientName} before it spoils!`;
  }
};

export const fetchRecipeIdea = async (ingredientName) => {
  try {
    const cleanName = encodeURIComponent(ingredientName.trim().toLowerCase());
    const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${cleanName}&number=1&apiKey=${SPOONACULAR_API_KEY}`);
    if (response.ok) {
      const data = await response.json();
      if (data.results?.length > 0) {
        return `Got extra ${ingredientName}? Try whipping up a quick skillet meal with it tonight!`;
      }
    }
  } catch (error) {
    console.log("❌ Recipe Suggestion Error:", error);
  }
  return `Your ${ingredientName} is expiring soon. Time to cook it up!`;
};