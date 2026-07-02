import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FridgeContext = createContext();

const STORAGE_KEY = 'FRIDGE_ITEMS';

const ACTIVITY_KEY = 'ACTIVITY_LOG';

export const FridgeProvider = ({ children }) => {

  const [items, setItems] = useState([]);
  const [activityLog, setActivityLog] = useState([]);


  useEffect(() => {
    loadItems();
    loadActivityLog();
  }, []);

  useEffect(() => {
    saveItems();
  }, [items]);

   useEffect(() => {
    saveActivityLog();
  }, [activityLog]);

  const logActivity = (action, item) => {
    const logEntry = {
      id: Date.now().toString(),
      action,
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      qty: item.qty,
      timestamp: new Date().toISOString(),
    };

    setActivityLog(prev => [...prev, logEntry]);
  };




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

const loadActivityLog = async () => {
  try {

    const storedLog =
      await AsyncStorage.getItem(ACTIVITY_KEY);

    if (storedLog !== null) {
      setActivityLog(JSON.parse(storedLog));
    }

  } catch (error) {
    console.log('Error loading activity log:', error);
  }
};

  const saveItems = async () => {
    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

    } catch (error) {
      console.log('Error saving items:', error);
    }
  };

  const saveActivityLog = async () => {
  try {

    const jsonValue =
      JSON.stringify(activityLog);

    await AsyncStorage.setItem(
      ACTIVITY_KEY,
      jsonValue
    );

  } catch (error) {
    console.log(
      'Error saving activity log:',
      error
    );
  }
};

  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);

    logActivity('added', newItem);
  };

  const removeItem = (id) => {

  const itemToRemove = items.find(
    item => item.id === id
  );

  if (itemToRemove) {
    logActivity('removed', itemToRemove);
  }

  setItems(prevItems =>
    prevItems.filter(item => item.id !== id)
  );
};

  const updateItem = (updatedItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const decreaseQty = (id) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty - 1), };
      }
      return item
    }));
  };

  const increaseQty = (id) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      );

      return updatedItems;
    });
  };


  return (
    <FridgeContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        increaseQty,
        decreaseQty,
       activityLog,
      }}>
      {children}
    </FridgeContext.Provider>
  );
};