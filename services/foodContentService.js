import { LOCAL_FRIDGE_DB } from '../utils/foodFactsData';

const FOOD_ALIASES = {
  zucchini: 'courgette', 
  aubergine: 'eggplant',
  bellpepper: 'bell_pepper',
  pepper: 'bell_pepper',
};

const fetchLiveFoodQuiz = async () => {
  try {
    const response = await fetch('https://the-trivia-api.com/v2/questions?limit=1&categories=food_and_drink');
    
    if (response.ok) {
      const data = await response.json();
      if (data && data[0]) {
        const quizItem = data[0];
        
        return {
          type: 'quiz',
          question: quizItem.question.text, 
          correctAnswer: quizItem.correctAnswer,
          incorrectAnswers: quizItem.incorrectAnswers
        };
      }
    }
  } catch (error) {
    console.log("❌ Dedicated Culinary Trivia API request failure:", error);
  }
};

export const getDynamicFridgeContent = async (currentFridgeItems = [], targetItem = '', currentFactIndex = 0) => {
  // 1. Clean up spaces and convert to lowercase
  let cleanTarget = targetItem.trim().toLowerCase().replace(/\s+/g, '_');
  
  // 2. Trim trailing 's' if it's a plural item
  if (cleanTarget.endsWith('s') && !cleanTarget.endsWith('ss')) {
    cleanTarget = cleanTarget.slice(0, -1);
  }

  // 3. 🌟 THE MISSING STEP: Intercept and swap the alias key here!
  if (FOOD_ALIASES[cleanTarget]) {
    cleanTarget = FOOD_ALIASES[cleanTarget];
  }

  // 4. Now this looks up 'courgette' instead of 'zucchini'
  const factArray = LOCAL_FRIDGE_DB[cleanTarget];

  if (factArray && factArray.length > 0 && currentFactIndex < factArray.length) {
    return { 
      type: 'fact', 
      text: factArray[currentFactIndex],
      totalFacts: factArray.length 
    };
  }
  
  return await fetchLiveFoodQuiz();
};