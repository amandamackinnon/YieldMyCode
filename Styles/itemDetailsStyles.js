import { StyleSheet, Platform } from 'react-native';

export const itemDetailsStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 50,
    paddingBottom: 60,
  },

  mainCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderColor: '#fff',
  },

  largeImage: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },

  titleText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'NunitoMedium',
  },

  genText: {
    marginTop: 35,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -15,
  },

  categoryText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    fontFamily: 'NunitoMedium',
  },

  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 20,
    gap: 30,
    marginLeft: -15,
  },

  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E7B1A6',
    backgroundColor: '#E7B1A6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
  },

  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },

  recipeButton: {
    flexDirection: 'row',
    backgroundColor: '#F6CA5E',
    paddingVertical: 12,
    borderRadius: 4,
    borderColor: '#292929',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    marginVertical: 15,
    marginLeft: -12,
  },

  recipeButtonText: {
    color: '#292929',
    fontFamily: 'NunitoBold',
    fontSize: 15,
  },

  recipeListContainer: {
    width: '85%',
    marginTop: 15,
    marginBottom: 30,
  },

  recipeSectionTitle: {
    fontFamily: 'NunitoBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },

  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#F6CA5E',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#292929',
    alignItems: 'center',
  },

  recipeImage: {
    width: 75,
    height: 75,
    backgroundColor: '#e1e1e1',
  },

  recipeInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  recipeTitle: {
    fontFamily: 'NunitoBold',
    fontSize: 14,
    color: '#333',
  },

  recipeMatchText: {
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  removeButtonText: {
    color: "#EF4E23",
    fontFamily: 'NunitoBold',
    fontSize: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },

  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 32,
    fontFamily: 'NunitoSemiBold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },

  headerSpacer: {
    width: 40,
  },

});
