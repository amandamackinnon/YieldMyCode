import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchIngredientFact = async (ingredientName) => {
  console.log("🚀 >>> ENTERING fetchIngredientFact IN SPOONACULAR.JS WITH:", ingredientName);
  let targetQuery = ingredientName.trim().toLowerCase();
  if (targetQuery.endsWith('s') && !targetQuery.endsWith('ss')) {
    targetQuery = targetQuery.slice(0, -1);
  }
  
  const cleanName = encodeURIComponent(targetQuery);

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

  // 1. Log the incoming structural data for apples
  console.log(`🍏 Spoonacular payload keys for ${targetQuery}:`, Object.keys(infoData));

  // 2. Primary check
  if (infoData.description && infoData.description.trim().length > 0) {
    return infoData.description.charAt(0).toUpperCase() + infoData.description.slice(1);
  }

  // 3. Concrete Metadata Fallback Engine
  if (infoData.aisle || infoData.consistency) {
    const cleanAisle = infoData.aisle ? infoData.aisle.toLowerCase() : 'fresh section';
    return `Did you know? ${ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} can typically be found over in the ${cleanAisle} aisle of your grocery store.`;
  }
}
      }
    }
  } catch (error) {
    console.log("❌ Food Fact API Error:", error);
  }

  // PATH 3: Pure safety fallback if the API rate limit hits zero
  const localBackups = [
    `Proper refrigeration control is key to preserving the natural freshness, nutrients, and quality of your ${ingredientName}.`,
    `Keeping your ${ingredientName} stored in an airtight container helps protect its flavor profile from absorbing other fridge odors.`,
    `Did you know? Consistent cold storage tracking is one of the best ways to extend the safe shelf life of ${ingredientName}.`
  ];
  
  return localBackups[Math.floor(Math.random() * localBackups.length)];
};