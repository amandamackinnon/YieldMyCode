import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FridgeContext = createContext();

const STORAGE_KEY = 'FRIDGE_ITEMS';

export const FridgeProvider = ({ children }) => {

  const [items, setItems] = useState([]);

  
  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async () => {

    try {

      const storedItems =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (storedItems !== null) {
        setItems(JSON.parse(storedItems));
         }

        } catch (error) {
        console.log('Error loading items:', error);
        }
  };

  const saveItems = async () => {
    try {
    const jsonValue = JSON.stringify(items);
        await AsyncStorage.setItem(
        STORAGE_KEY,
        jsonValue
      );

      } catch (error) {
        console.log( 'Error saving items:', error );
      }
    };

  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
      };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
      };

  const updateItem = (updatedItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      };

  const decreaseQty = (id) => {
    setItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
          return {...item, qty: Math.max(1, item.qty - 1),};
        }
        return item }) );
    };
        return (
    <FridgeContext.Provider
      value={{ 
        items, 
        addItem,
        removeItem,
        updateItem,
        decreaseQty,
        }}>
      {children}
    </FridgeContext.Provider>
  );
};