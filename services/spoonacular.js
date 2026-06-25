import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchFoodTrivia = async () => {
  try {
    const response = await fetch(`https://api.spoonacular.com/food/trivia/random?apiKey=${SPOONACULAR_API_KEY}`);
    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
  } catch (error) {
    console.log("❌ Trivia Fetch Error:", error);
  }
  return "Did you know storing food properly extends its shelf life?";
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