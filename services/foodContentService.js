const LOCAL_FRIDGE_DB = {
  yogurt: "Did you know that the word 'yogurt' comes from a Turkish word meaning 'to curdle or thicken'?",
  salmon: "Wild salmon get their distinct pink color naturally from eating a steady diet of shrimp and krill!",
  egg: "To check if your eggs are still fresh, drop them in water. Fresh eggs sink completely, while old ones float!",
  potato: "Did you know that potatoes were the very first vegetable to be successfully grown in microgravity in space back in 1995?",
  apple: "Apples float in water because 25% of their total volume is actually pure air!"
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

  return {
    type: 'quiz',
    question: "What is the main ingredient used to make traditional Guacamole?",
    correctAnswer: "Avocado",
    incorrectAnswers: ["Tomato", "Lime", "Cucumber"]
  };
};

export const getDynamicFridgeContent = async (currentFridgeItems = [], targetItem = '') => {
  let cleanTarget = targetItem.trim().toLowerCase();
  if (cleanTarget.endsWith('s') && !cleanTarget.endsWith('ss')) {
    cleanTarget = cleanTarget.slice(0, -1);
  }

  if (LOCAL_FRIDGE_DB[cleanTarget]) {
    return { 
      type: 'fact', 
      text: LOCAL_FRIDGE_DB[cleanTarget] 
    };
  }

  return await fetchLiveFoodQuiz();
};