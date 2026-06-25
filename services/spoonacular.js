
import Constants from 'expo-constants';


const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export const fetchFoodTrivia = async (ingredientName) => {
  const cleanName = ingredientName.trim().toLowerCase();

  try {
    const jokeResponse = await fetch(`https://api.spoonacular.com/food/jokes/random?apiKey=${SPOONACULAR_API_KEY}`);
    
    if (jokeResponse.ok) {
      const jokeData = await jokeResponse.ok ? await jokeResponse.json() : null;
      if (jokeData && jokeData.text) {
        return `Food Joke! ${jokeData.text}`;
      }
    }
  } catch (error) {
    console.log("⚠️ Joke API missed, cascading to recipe finder...");
  }

  const recipeFallback = await fetchRecipeIdea(cleanName);
  if (recipeFallback) {
    return recipeFallback;
  }

  return `Your ${ingredientName} is due to expire soon. Let's make sure it doesn't go to waste!`;
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

 const limitSentences = (text, maxSentences = 2) => {
  if (!text) return '';

  // Matches sentence endings (. ! ?) followed by spaces or end of string
  const sentenceEndRegex = /([.!?]\s+)/;
  const tokens = text.split(sentenceEndRegex);
  
  const sentences = [];
  // Reconstruct sentences with their punctuation intact
  for (let i = 0; i < tokens.length; i += 2) {
    if (tokens[i]) {
      const punct = tokens[i + 1] || '';
      sentences.push(tokens[i].trim() + punct.trim());
    }
  }

  // If the joke is within limits, return it as-is
  if (sentences.length <= maxSentences) {
    return text;
  }

  // Otherwise, join up to the limit and append a clean trailing indicator
  return sentences.slice(0, maxSentences).join(' ') + '...';
};
};