import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getDynamicFridgeContent } from '../services/foodContentService'; 
import { FoodTriviaStyles as styles } from '../Styles/FoodTriviaStyles';

const factIndexTracker = {};

export default function FoodTriviaScreen({ route, navigation }) { 
  const { ingredient } = route.params || {};
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setSelectedAnswer(null);
      
      if (!ingredient) {
        setContent({ type: 'error', text: 'No ingredient specified.' });
        setLoading(false);
        return;
      }

      const lowerName = ingredient.trim().toLowerCase();
      
      if (factIndexTracker[lowerName] === undefined) {
        factIndexTracker[lowerName] = 0;
      }

      const result = await getDynamicFridgeContent([], ingredient, factIndexTracker[lowerName]);
      
      if (result) {
        setContent(result);
        
        if (result.type === 'fact') {
          factIndexTracker[lowerName] += 1;
        } 
        else if (result.type === 'quiz') {
          const combined = [result.correctAnswer, ...result.incorrectAnswers];
          setShuffledAnswers(combined.sort(() => Math.random() - 0.5));
        }
      } else {
        setContent({ type: 'error', text: 'Could not fetch trivia context at this time.' });
      }
      setLoading(false);
    };

    loadContent();
  }, [ingredient, route.params?.clickId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E07A5F" />
      </View>
    );
  }

  if (content?.type === 'fact') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.factCard}>
          <Text style={styles.iconHeader}>💡 Did you know?</Text>
          <Text style={styles.factText}>{content.text}</Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Food for thought!</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }


  if (content?.type === 'quiz') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.quizCard}>
          <Text style={styles.iconHeader}>🍳 Food Quiz</Text>
          <Text style={styles.questionText}>{content.question}</Text>
          
          <View style={styles.optionsWrapper}>
            {shuffledAnswers.map((answer, idx) => {
              const isCorrect = answer === content.correctAnswer;
              const isSelected = selectedAnswer === answer;
              
              let buttonStyle = styles.optionBtn;
              let textStyle = styles.optionText;

              if (selectedAnswer) {
                if (isCorrect) {
                  buttonStyle = [styles.optionBtn, styles.correctBtn];
                  textStyle = [styles.optionText, styles.whiteText];
                } else if (isSelected) {
                  buttonStyle = [styles.optionBtn, styles.wrongBtn];
                  textStyle = [styles.optionText, styles.whiteText];
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  disabled={selectedAnswer !== null}
                  style={buttonStyle}
                  onPress={() => setSelectedAnswer(answer)}
                >
                  <Text style={textStyle}>{answer}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {selectedAnswer && (
            <Text style={[styles.feedbackText, { color: selectedAnswer === content.correctAnswer ? '#699966' : '#EF4E23' }]}>
              {selectedAnswer === content.correctAnswer ? '⭐️ Correct! Now you\'re cooking!' : '❌ Incorrect, better luck next time!'}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Close Trivia</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.factText}>{content?.text || 'An unknown error occurred.'}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
