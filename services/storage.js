import AsyncStorage from '@react-native-async-storage/async-storage';

const FRIDGE_KEY = 'FRIDGE_ITEMS';

export const saveFridgeItems = async (items) => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(FRIDGE_KEY, jsonValue);
  } catch (e) {
    console.log('Error saving fridge items', e);
  }
};

export const loadFridgeItems = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FRIDGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log('Error loading fridge items', e);
    return [];
  }
};