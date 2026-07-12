import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getDynamicFridgeContent } from '../services/foodContentService'; 

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
              {selectedAnswer === content.correctAnswer ? '🎉 Correct Answer!' : '❌ Incorrect, try another next time!'}
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

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF', justifyContent: 'center', padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  factCard: { backgroundColor: '#F4F1DE', padding: 28, borderRadius: 16, borderLeftWidth: 5, borderLeftColor: '#E07A5F' },
  quizCard: { backgroundColor: '#F4F1DE', padding: 24, borderRadius: 16 },
  iconHeader: { fontSize: 20, fontFamily: 'NunitoBold', color: '#E07A5F', marginBottom: 12 },
  factText: { fontSize: 18, fontFamily: 'NunitoMedium', color: '#2D3142', lineHeight: 26 },
  subText: { fontSize: 11, fontFamily: 'NunitoRegular', color: '#999999', marginTop: 16, textAlign: 'right' },
  questionText: { fontSize: 18, fontFamily: 'NunitoSemiBold', color: '#2D3142', marginBottom: 20, lineHeight: 24 },
  optionsWrapper: { width: '100%', marginTop: 8 },
  optionBtn: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  optionText: { fontSize: 15, fontFamily: 'NunitoMedium', color: '#2D3142' },
  correctBtn: { backgroundColor: '#699966', borderColor: '#699966' },
  wrongBtn: { backgroundColor: '#EF4E23', borderColor: '#EF4E23' },
  whiteText: { color: '#FFF', fontFamily: 'NunitoBold' },
  feedbackText: { marginTop: 16, textAlign: 'center', fontSize: 16, fontFamily: 'NunitoBold' },
  
  // 🌟 Added Close Button Styles
  closeButton: {
    marginTop: 24,
    backgroundColor: '#2D3142',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'NunitoBold',
  }
});