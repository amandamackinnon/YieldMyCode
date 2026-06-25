import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchIngredientFact = async (ingredientName) => {
  const cleanName = encodeURIComponent(ingredientName.trim().toLowerCase());

  try {
    const searchResponse = await fetch(
      `https://api.spoonacular.com/food/ingredients/search?query=${cleanName}&number=1&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      
      if (searchData.results && searchData.results.length > 0) {
        const ingredientId = searchData.results.id;

        const infoResponse = await fetch(
          `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${SPOONACULAR_API_KEY}`
        );

        if (infoResponse.ok) {
          const infoData = await infoResponse.json();

          if (infoData.description) {
            return infoData.description.charAt(0).toUpperCase() + infoData.description.slice(1);
          }
        }
      }
    }
  } catch (error) {
    console.log("❌ Food Fact API Error:", error);
  }

  const localBackups = [
    `Storing your ${ingredientName} away from moisture keeps it crisp and extends its shelf life significantly.`,
    `Proper temperature control is key to preserving the natural nutrients and vibrant color of ${ingredientName}.`,
    `Keeping ${ingredientName} in an airtight container helps preserve its flavor profile for future meals.`
  ];
  
  return localBackups[Math.floor(Math.random() * localBackups.length)];
};

export const fetchRecipeIdea = async (ingredientName) => {
  try {
    const cleanName = encodeURIComponent(ingredientName.trim().toLowerCase());

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${cleanName}&number=1&ranking=1&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (response.ok) {
      const recipes = await response.json();

      if (recipes && recipes.length > 0) {
        const recipeTitle = recipes.title;
        return `Recipe Suggestion: Turn your extra ${ingredientName} into a delicious "${recipeTitle}" tonight!`;
      }
    }
  } catch (error) {
    console.log("❌ Recipe Suggestion Error:", error);
  }

  return `Your ${ingredientName} is expiring soon. Time to cook it up!`;
};
 