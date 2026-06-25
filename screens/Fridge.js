import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Platform, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FridgeContext } from '../context/FridgeContext';
import { categories, getNotificationData } from '../utils/fridgeHelpers';
import { fetchFoodTrivia, fetchRecipeIdea } from '../services/spoonacular';
import FridgeTile from '../components/FridgeTile';


export default function Fridge({ navigation, route }) {
  const { items } = useContext(FridgeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState([]);

const handleJokePress = async (ingredientName) => {
  console.log("🎯 Joke clicked for:", ingredientName); // Debug log to verify string passes through
  if (!ingredientName) {
    Alert.alert("Oops", "We couldn't verify this ingredient name.");
    return;
  }
  
  try {
    const rawJokeText = await fetchFoodTrivia(ingredientName); 
    const punchyJoke = limitSentences(rawJokeText, 2); 
    Alert.alert("Food Fun!", punchyJoke, [{ text: "Awesome" }]);
  } catch (err) {
    console.log("Error running joke helper:", err);
  }
};

const handleRecipePress = (ingredientName) => {
  if (!ingredientName) return;

  setShowNotifications(false);

  navigation.navigate('RecipeDetails', { 
    ingredient: ingredientName,
    autoLoad: true 
  });
};

  const [previousNotificationState, setPreviousNotificationState] = useState(null);
  const flatListRef = useRef(null);

  const toggleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const handleMarkAllOrUndo = () => {
    const allAreRead = notifications.length > 0 && notifications.every(n => n.isRead);
    
    if (allAreRead && previousNotificationState) {
      setNotifications(previousNotificationState);
      setPreviousNotificationState(null);
    } else {
      setPreviousNotificationState([...notifications]);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  useEffect(() => {
  const syncAlerts = () => {
    if (!items || items.length === 0) {
      setNotifications([]);
      return;
    }
    
    const baseline = getNotificationData(items);
    const enhanced = baseline.map((alert) => {
      const cached = notifications.find(n => n.id === alert.id);
      if (cached) return cached;

      const origin = items.find(i => `expire-${i.id}` === alert.id);
      
      return { 
        ...alert, 
        text: origin ? `${origin.name} expires soon!` : alert.text,
        ingredientName: origin ? origin.name : null,
        isRead: false 
      };
    });

    setNotifications(enhanced);
  };
  syncAlerts();
}, [items]);

  useEffect(() => {
    if (showNotifications) {
      setTimeout(() => flatListRef.current?.flashScrollIndicators(), 150);
    }
  }, [showNotifications]);

  useEffect(() => {
    if (route.params?.toggleNotifications) {
      setShowNotifications(true);
      navigation.setParams({ toggleNotifications: undefined });
    }
  }, [route.params?.toggleNotifications]);

  const [fontsLoaded] = useFonts({
    NunitoRegular: Nunito_400Regular, NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold, NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded) return null;

  const filteredInventory = items.filter(i => selectedCategory === 'All' || i.category === selectedCategory);
  
  const allRead = notifications.length > 0 && notifications.every(n => n.isRead);

  return (
    <View style={styles.container}>
      <Modal visible={showNotifications} transparent animationType="fade">
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowNotifications(false)}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
          )}
        </TouchableOpacity>

        <View style={styles.notificationDropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Notifications</Text>
            
            <TouchableOpacity onPress={handleMarkAllOrUndo}>
              <Text style={styles.markAsRead}>
                {allRead && previousNotificationState ? "Undo Mark All" : "Mark all as read"}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={notifications}
            keyExtractor={item => item.id}
            persistentScrollbar
            showsVerticalScrollIndicator
           renderItem={({ item }) => (
    <View style={styles.notificationContainerCell}>
      <View style={styles.notificationItem}>
        <TouchableOpacity onPress={() => toggleMarkAsRead(item.id)}>
          <View style={[styles.indicatorDot, { backgroundColor: item.isRead ? '#FFFFFF' : '#E07A5F', borderColor: '#E07A5F' }]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleMarkAsRead(item.id)}>
          <Text style={[styles.notificationText, { color: item.isRead ? '#999999' : '#2D3142', fontFamily: item.isRead ? 'NunitoRegular' : 'NunitoMedium' }]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>

      {item.ingredientName && !item.isRead && (
        <View style={styles.actionLinksContainer}>
          <TouchableOpacity 
            onPress={() => handleJokePress(item.ingredientName)} 
            style={styles.linkTouchTarget}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
          >
            <Text style={styles.actionLinkText}>Would you like to see a joke?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleRecipePress(item.ingredientName)} 
            style={styles.linkTouchTarget}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionLinkText}>Would you like to see a recipe?</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
            )}
          />
        </View>
      </Modal>

      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={{ fontSize: 1, color: 'transparent' }}
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        renderLeftIcon={() => <Ionicons name="search" size={25} color="grey" style={{ marginRight: 10 }} />}
        renderRightIcon={() => <View style={{ width: 0, height: 0 }} />}
      />

      <FlatList
        data={filteredInventory}
        renderItem={({ item, index }) => <FridgeTile item={item} index={index} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingRight: -20,
    paddingTop: 15,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: '#D9D9D966',
    borderRadius: 2,
    padding: 12,
    marginBottom: 15,
  },
 emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  dropdownContainer: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,

  },

  placeholderStyle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'NunitoMedium',
  },
  selectedTextStyle: {
    fontSize: 1,
    color: 'transparent',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoMedium',
  },

  tileHeader: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    alignItems: 'center',
  },

    dateLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'NunitoMedium',
  },
  expiryText: {
    marginTop: 4,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: 'NunitoMedium',
    fontSize: 14,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  urgentRed: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF3800',
    color: '#FF3800',
  },
  warningYellow: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FFC700',
    color: '#FFC700',
  },

  emptyText: {
    textAlign: 'center',
    fontFamily: 'NunitoSemiBold',
    marginTop: 50,
    color: '#999',
    fontSize: 30,
  },
  
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  bannerOverlay: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  bannerRed1: {
    backgroundColor: '#FF380080',
  },

  bannerRed: {
    backgroundColor: '#FF3800',
  },
  bannerOrange: {
    backgroundColor: '#FFC70080',
  },
  bannerText: {
    color: 'white',
    fontFamily: 'NunitoBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  minusButton: {
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  minusText: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold'
  },

  deleteButton: {
    marginLeft: 5,
  },

  emptyImage: {
    height: 500,
    width: 500,
    marginLeft: -30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  notificationDropdown: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 4,
    borderColor: '#E07A5F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },

  markAsRead: {
    fontFamily: "NunitoBold",
    textDecorationLine: "underline",
  },

  dropdownTitle: {
    fontFamily: "NunitoBold",
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EAEAEA',
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },


});