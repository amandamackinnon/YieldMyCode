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
      unit: item.unit || 'pcs', 
      timestamp: new Date().toISOString(),
    };

    setActivityLog(prev => [logEntry, ...prev]);
  };

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems !== null) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.log('Error loading items:', error);
    }
  };

  const loadActivityLog = async () => {
    try {
      const storedLog = await AsyncStorage.getItem(ACTIVITY_KEY);
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
      const jsonValue = JSON.stringify(activityLog);
      await AsyncStorage.setItem(ACTIVITY_KEY, jsonValue);
    } catch (error) {
      console.log('Error saving activity log:', error);
    }
  };

  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
    logActivity('added', newItem);
  };

  const removeItem = (id, status = 'removed') => {
    const itemToLog = items.find(i => i.id === id);
    if (!itemToLog) return;

    const newLogEntry = {
      id: Date.now().toString(),
      itemName: itemToLog.name,
      qty: itemToLog.qty,
      unit: itemToLog.unit || 'pcs', 
      category: itemToLog.category,
      action: status, 
      timestamp: new Date().toISOString(),
    };

    setActivityLog(prev => [newLogEntry, ...prev]);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const consumeItem = (id) => {
    removeItem(id, 'consumed');
  };

  const wasteItem = (id) => {
    removeItem(id, 'wasted');
  };

  const updateItem = (updatedItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const decreaseQty = (id, amountToSubtract, status = null) => {
    setItems(prevItems => {
      const targetItem = prevItems.find(item => item.id === id);
      if (!targetItem) return prevItems;

      const amt = Number(amountToSubtract) || 1;

      // If a status is passed, log exactly that amount to history!
      if (status) {
        const partialLogEntry = {
          id: Date.now().toString(),
          itemName: targetItem.name,
          qty: amt, // 🌟 Logs the exact amount (e.g., 100)
          unit: targetItem.unit || 'pcs',
          category: targetItem.category,
          action: status,
          timestamp: new Date().toISOString(),
        };
        setActivityLog(prevLog => [partialLogEntry, ...prevLog]);
      }

      // Modify the inventory numbers in the fridge
      return prevItems.map(item => {
        if (item.id === id) {
          const newQty = item.qty - amt;
          // If they consume everything or more than what's left, we will handle removal
          return { ...item, qty: Math.max(0, newQty) };
        }
        return item;
      }).filter(item => item.qty > 0); // Automatically clear item if qty hits 0!
    });
  };

  const increaseQty = (id) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const clearActivityLog = async () => {
    try {
      await AsyncStorage.removeItem(ACTIVITY_KEY);
      setActivityLog([]);
    } catch (error) {
      console.log('Error clearing logs:', error);
    }
  };

  return (
    <FridgeContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        consumeItem,
        wasteItem,
        clearActivityLog, 
        updateItem,
        increaseQty,
        decreaseQty,
        activityLog,
      }}>
      {children}
    </FridgeContext.Provider>
  );
};