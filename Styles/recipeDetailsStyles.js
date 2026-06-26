import { StyleSheet, Platform } from 'react-native';

export const recipeDetailsStyles = StyleSheet.create({
    centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  container: { 
    padding: 20, 
    backgroundColor: '#fff'
  },

    loadingText: {
    marginTop: 12,
    fontFamily: 'NunitoMedium',
    color: '#666',
  },

   errorText: {
    fontFamily: 'NunitoSemiBold',
    color: '#999',
  },

  recipeImage: { 
    width: '100%', 
    height: 220, 
    borderRadius: 12, 
    marginBottom: 15
   },

  title: { 
    fontFamily: 'NunitoBold', 
    fontSize: 24, 
    color: '#333', 
    marginBottom: 20 
  },

  section: { 
    marginBottom: 25
   },

  sectionTitle: { 
    fontFamily: 'NunitoBold', 
    fontSize: 18, 
    color: 'rgba(236, 96, 57, 1)', 
    marginBottom: 10 
  },

  bulletItem: { 
    fontFamily: 'NunitoMedium', 
    fontSize: 15, color: '#555', 
    marginBottom: 5, 
    lineHeight: 22 
  },

  stepContainer: { 
    marginBottom: 15 
  },

  stepNumber: { 
  fontFamily: 'NunitoBold', 
  fontSize: 14, 
  color: '#333', 
  marginBottom: 2 
},

  stepText: { 
    fontFamily: 'NunitoMedium', 
    fontSize: 15, 
    color: '#666', 
    lineHeight: 22 
  },
}); 