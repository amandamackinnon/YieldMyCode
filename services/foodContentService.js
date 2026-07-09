import { LOCAL_FRIDGE_DB } from '../utils/foodFactsData'

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
  let cleanTarget = targetItem.trim().toLowerCase();
  if (cleanTarget.endsWith('s') && !cleanTarget.endsWith('ss')) {
    cleanTarget = cleanTarget.slice(0, -1);
  }

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