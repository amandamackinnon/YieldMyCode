import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchRecipeIdea = async (ingredientName) => {
  try {

    const cacheBuster = Date.now();

    
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredientName)}&number=20&cb=${cacheBuster}&apiKey=${SPOONACULAR_API_KEY}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
  
        const randomIndex = Math.floor(Math.random() * data.results.length);
        return data.results[randomIndex];
      }
    }
  } catch (error) {
    console.log("❌ Error fetching randomized recipe:", error);
  }
  return null;
};