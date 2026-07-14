import { StyleSheet, Platform } from 'react-native';

export const FoodTriviaStyles = StyleSheet.create({

container: { 
    flexGrow: 1, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    padding: 24 
},
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
},
  factCard: { 
    backgroundColor: 'rgba(236, 96, 57, 1)', 
    padding: 28, 
    borderRadius: 16
},
  quizCard: { 
    backgroundColor: "rgba(246, 202, 94, 1)", 
    padding: 24, 
    borderRadius: 16 
},
  iconHeader: { 
    fontSize: 20, 
    fontFamily: 'NunitoBold', 
    color: 'white', 
    marginBottom: 12 
},
  factText: { 
    fontSize: 18, 
    fontFamily: 'NunitoMedium', 
    color: 'white', 
    lineHeight: 26 
},
  subText: { 
    fontSize: 11, 
    fontFamily: 'NunitoRegular', 
    color: '#999999', 
    marginTop: 16, 
    textAlign: 'right' 
},
  questionText: { 
    fontSize: 18, 
    fontFamily: 'NunitoSemiBold', 
    color: 'white', 
    marginBottom: 20, 
    lineHeight: 24 
},
  optionsWrapper: { 
    width: '100%', 
    marginTop: 8 
},
  optionBtn: { 
    backgroundColor: '#FFFFFF', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#E0E0E0' 
},
  optionText: { 
    fontSize: 15, 
    fontFamily: 'NunitoMedium', 
    color: '#2D3142' 
},
  correctBtn: { 
    backgroundColor: '#699966', 
    borderColor: '#699966' 
},
  wrongBtn: { 
    backgroundColor: '#EF4E23', 
    borderColor: '#EF4E23' 
},
  whiteText: { 
    color: '#FFF', 
    fontFamily: 'NunitoBold' 
},
  feedbackText: { 
    marginTop: 16, 
    textAlign: 'center', 
    fontSize: 16, 
    fontFamily: 'NunitoBold' 
},
    closeButton: {
    marginTop: 24,
    backgroundColor: 'rgba(79, 107, 183, 1)',
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

})