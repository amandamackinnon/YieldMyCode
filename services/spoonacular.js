import Constants from 'expo-constants';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchIngredientFact = async (ingredientName) => {

  let targetQuery = ingredientName.trim().toLowerCase();
  if (targetQuery.endsWith('s') && !targetQuery.endsWith('ss')) {
    targetQuery = targetQuery.slice(0, -1);
  }
  
  const cleanName = encodeURIComponent(targetQuery);

  try {
    const searchUrl = `https://api.spoonacular.com/food/ingredients/search?query=${cleanName}&number=1&apiKey=${SPOONACULAR_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      
      let foundId = null;
      if (searchData.results && searchData.results[0]) {
        foundId = searchData.results[0].id;
      }

      const ingredientId = foundId;
    

      if (!ingredientId) {
        return `${ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} is a great addition to a healthy diet.`;
      }

      const infoUrl = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${SPOONACULAR_API_KEY}`;
  
      
      const infoResponse = await fetch(infoUrl);

      if (infoResponse.ok) {
        const infoData = await infoResponse.json();

        if (infoData.description && infoData.description.trim().length > 0) {
          return infoData.description.charAt(0).toUpperCase() + infoData.description.slice(1);
        }

        if (infoData.aisle || infoData.consistency) {
          const capitalizedName = ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);
          const cleanAisle = infoData.aisle ? infoData.aisle.toLowerCase() : 'grocery section';
          return `${capitalizedName} can typically be found over in the ${cleanAisle} department. It is classified as a standard ${infoData.consistency || 'fresh'} food item.`;
        }

        return `${ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)} is verified in standard nutritional databases. Keep it properly sealed and tracked for optimal use.`;
      }
    }
  } catch (error) {
    console.log("❌ CRITICAL EXCEPTION CAUGHT INSIDE FETCH BLOCK:", error);
  }

  console.log("🛑 Pipeline fell through. Serving local storage array.");
  const localBackups = [
    `Proper refrigeration control is key to preserving the natural freshness, nutrients, and quality of your ${ingredientName}.`,
    `Keeping your ${ingredientName} stored in an airtight container helps protect its flavor profile from absorbing other fridge odors.`,
    `Did you know? Consistent cold storage tracking is one of the best ways to extend the safe shelf life of ${ingredientName}.`
  ];
  
  return localBackups[Math.floor(Math.random() * localBackups.length)];
};