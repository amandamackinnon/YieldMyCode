import React, { useState, useContext, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FridgeContext } from '../context/FridgeContext';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';

const categories = [
  { label: 'All Categories', value: 'All' },
  { label: 'Bread & Baked Goods', value: 'Bread & Baked Goods' },
  { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
  { label: 'Fish & Meat', value: 'Fish & Meat' },
  { label: 'Fruit & Veggies', value: 'Fruit & Veggies' },
  { label: 'Grains', value: 'Grains' },
  { label: 'Pasta & Rice', value: 'Pasta & Rice' },
  { label: 'Preserves & Sauces', value: 'Preserves & Sauces' },
  { label: 'Other', value: 'Other' },
];

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

const fetchFoodTrivia = async () => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/food/trivia/random?apiKey=${SPOONACULAR_API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      return data.text;
    }
  } catch (error) {
    console.log("❌ Trivia Fetch Error:", error);
  }
  return "Did you know storing food properly extends its shelf life?"; // Fallback
};

// Fetch a quick recipe suggestion based on the specific expiring ingredient (e.g., "Pork")
const fetchRecipeIdea = async (ingredientName) => {
  try {
    const cleanName = encodeURIComponent(ingredientName.trim().toLowerCase());
    const response = await fetch(
      `https://api.spoonacular.com/food/ingredients/search?query=${cleanName}&number=1&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // You can link them or show the title of a trending recipe matching this item!
        return `Got extra ${ingredientName}? Try whipping up a quick skillet meal with it tonight!`;
      }
    }
  } catch (error) {
    console.log("❌ Recipe Suggestion Error:", error);
  }
  return `Your ${ingredientName} is expiring soon. Time to cook it up!`; // Fallback
};

const getNotificationData = (fridgeItems) => {
  if (!fridgeItems) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  const notifications = [];

  fridgeItems.forEach((item) => {
    if (!item.expiryDate) return;
    try {
      const cleanStr = item.expiryDate.replace(/Expires:\s*/i, '').trim();
      const [day, month, year] = cleanStr.split('/');
      const expiryDateObj = new Date(year, month - 1, day);
      expiryDateObj.setHours(0, 0, 0, 0);

      if (expiryDateObj <= threeDaysFromNow) {
        const daysLeft = Math.round((expiryDateObj - today) / (1000 * 60 * 60 * 24));
        const itemName = item.name.toLowerCase();
        const isPlural = itemName.endsWith('s');
        const hasHave = isPlural ? 'have' : 'has';
        const expireExpires = isPlural ? 'expire' : 'expires';

        let message = `Your ${itemName} ${expireExpires} soon!`;

        if (daysLeft === 0) {
          message = `The ${itemName} ${expireExpires} today`;
        }

        if (daysLeft === 1) {
          message = `The ${itemName} ${expireExpires} tomorrow`;
        }

        if (daysLeft < 0) {
          message = `The ${itemName} ${hasHave} expired!`;
        }

        notifications.push({
          id: `expire-${item.id}`,
          text: message,
          type: 'expiry',
          urgent: daysLeft <= 1
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  if (fridgeItems.length > 0) {
    const randomItem = fridgeItems[Math.floor(Math.random() * fridgeItems.length)].name.toLowerCase();
    notifications.push({
      id: 'recipe-suggest',
      text: `Got extra ${randomItem}? Use them to prepare a milkshake!`,
      type: 'recipe',
      urgent: false
    });
  }

  return notifications;
};

const getDaysLeft = (expiryDateStr) => {
  if (!expiryDateStr || typeof expiryDateStr !== 'string' || expiryDateStr.trim() === '') {
    return { text: 'No Expiry Set', days: 999 };
  }
  try {
    const cleanStr = expiryDateStr.replace(/Expires:\s*/i, '').trim();
    const dateParts = cleanStr.split('/');
    if (dateParts.length !== 3) return { text: 'Invalid Format', days: 999 };
    const [dayStr, monthStr, yearStr] = dateParts;
    const expDay = parseInt(dayStr, 10);
    const expMonth = parseInt(monthStr, 10) - 1;
    const expYear = parseInt(yearStr, 10);

    if (isNaN(expDay) || isNaN(expMonth) || isNaN(expYear)) return { text: 'Invalid Numbers', days: 999 };

    const expiryDate = new Date(expYear, expMonth, expDay, 12, 0, 0);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Expires today', days: diffDays };
    if (diffDays === 1) return { text: '1 day left', days: diffDays };
    if (diffDays < 0) {
      const positiveDays = Math.abs(diffDays);
      return { text: `${positiveDays} ${positiveDays === 1 ? 'day' : 'days'} ago`, days: diffDays };
    }
    return { text: `${diffDays} days left`, days: diffDays };
  } catch (error) {
    return { text: 'Calc Error', days: 999 };
  }
};

const TILE_COLORS = ['#4F6BB7', '#E7B1A6', '#B2DFE8', '#EC6039', '#E7C665', '#699966'];
const EXPIRED_TILE_COLORS = ['#4F6BB780', '#E7B1A680', '#B2DFE880', '#EC603980', '#E7C66580', '#69996680'];

export default function Fridge({ navigation, route }) {
  const { items, removeItem, decreaseQty } = useContext(FridgeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const flatListRef = useRef(null);


  const toggleMarkAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

React.useEffect(() => {
    const processNotificationAlerts = async () => {
      if (!items || items.length === 0) {
        setNotifications([]);
        return;
      }

      // 1. Generate standard date notifications locally first
      const baselineAlerts = getNotificationData(items);

      // 2. Loop through and enhance with Spoonacular API calls if missing
      const enhancedAlertPromises = baselineAlerts.map(async (alert) => {
        // Check if we have already compiled this exact notification to avoid duplicate hits
        const historicalMatch = notifications.find(n => n.id === alert.id);
        if (historicalMatch) {
          return historicalMatch; // Keep existing data and read/unread state intact
        }

        // It's a brand new alert! Let's fetch dynamic text for it
        let customizedMessage = alert.text;
        
        // Find corresponding item properties
        const itemOrigin = items.find(i => `expire-${i.id}` === alert.id || i.id === alert.id);
        
        if (itemOrigin) {
          const lowerName = itemOrigin.name.toLowerCase();
          if (lowerName.includes('pork') || itemOrigin.category === 'Fish & Meat') {
            customizedMessage = await fetchRecipeIdea(itemOrigin.name);
          } else if (alert.type === 'expiry') {
            const funFact = await fetchFoodTrivia();
            customizedMessage = `⚠️ ${itemOrigin.name} expires soon! Trivia: ${funFact}`;
          }
        }

        return {
          ...alert,
          text: customizedMessage,
          isRead: false
        };
      });

      const finalizedAlertsList = await Promise.all(enhancedAlertPromises);
      setNotifications(finalizedAlertsList);
    };

    processNotificationAlerts();
  }, [items]); // Only triggers when item counts or product traits alter

  React.useEffect(() => {
    if (showNotifications) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.flashScrollIndicators();
        }
      }, 150);
    }
  }, [showNotifications]);

  React.useEffect(() => {
    if (route.params?.toggleNotifications) {
      setShowNotifications(true);
      navigation.setParams({ toggleNotifications: undefined });
    }
  }, [route.params?.toggleNotifications]);
  
  const activeNotifications = getNotificationData(items);
  const totalNotifications = activeNotifications.length;

  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  const filteredInventory = items.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const renderItem = ({ item, index }) => {
    const info = getDaysLeft(item.expiryDate);
    const itemHasExpired = info.days < 0;

     const backgroundColor = itemHasExpired
      ? EXPIRED_TILE_COLORS[index % EXPIRED_TILE_COLORS.length]
      : TILE_COLORS[index % TILE_COLORS.length];

    let bannerElement = null;
    if (info.days >= 0 && info.days <= 3) {
      bannerElement = (
        <View style={[styles.bannerOverlay, styles.bannerRed1]}>
          <Text style={styles.bannerText}>⏰ PLEASE HURRY!</Text>
        </View>
      );
    } else if (info.days >= 4 && info.days <= 5) {
      bannerElement = (
        <View style={[styles.bannerOverlay, styles.bannerOrange]}>
          <Text style={styles.bannerText}>⏳ SLOWLY DYING...</Text>
        </View>
      );
    }

    let statusColor = '#FFFFFF';
    if (info.days < 0) statusColor = 'grey';
    else if (info.days >= 0 && info.days <= 3) statusColor = '#FF3800';
    else if (info.days >= 4 && info.days <= 5) statusColor = '#FFC700';


    const getImageSource = () => {
      if (!item.imageUrl || item.imageUrl.trim() === '' || item.imageUrl.includes('no.jpg')) {
        return require('../assets/modal-tile-image.png');
      }
      return { uri: item.imageUrl };
    };

    

    return (
      <View style={[styles.tileContainer, itemHasExpired && styles.expiredTile]}>
        <View style={styles.tile}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
          >
            <View style={[styles.imageBackgroundCircle, { backgroundColor }]}>
              <View style={[styles.innerWhiteCircle, itemHasExpired && styles.expiredInnerCircle]}>
                <Image source={getImageSource()} style={[styles.foodImage, itemHasExpired && styles.expiredImage]} resizeMode="contain" />
              </View>
              {bannerElement}
              <Text style={[styles.itemName, itemHasExpired && styles.expiredText]}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.tileFooterRow}>
            <View style={styles.qtyBox}>
              <Text style={styles.qtyText}>{`${item.qty} ${item.unit || 'pcs'}`}</Text>
            </View>
            <View style={styles.expiryBadgeContainer}>
              <Text style={[styles.cleanExpiryText, itemHasExpired && styles.expiredText]} numberOfLines={1}>
                {info.text}
              </Text>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}>
          <BlurView intensity={20} tint="dark" style={[StyleSheet.absoluteFill, Platform.OS === 'android' && { backgroundColor: 'rgba(0, 0, 0, 0.05)' }]} />
        </TouchableOpacity>

        <View style={styles.notificationDropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Notifications</Text>


            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAsRead}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={notifications}
            keyExtractor={(item) => item.id}
            persistentScrollbar={true}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: 1 }}
            ListEmptyComponent={
              <Text style={styles.emptyNotificationText}>Your fridge is fully restocked and stable!</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>

                <TouchableOpacity onPress={() => toggleMarkAsRead(item.id)}>
                  <View style={[
                    styles.indicatorDot,
                    { backgroundColor: item.isRead ? '#FFFFFF' : '#E07A5F', borderColor: '#E07A5F' }
                  ]} />
                </TouchableOpacity>

                <Text style={[
                  styles.notificationText,
                  {
                    color: item.isRead ? '#999999' : '#2D3142',
                    fontFamily: item.isRead ? 'NunitoRegular' : 'NunitoMedium'
                  }
                ]}>
                  {item.text}
                </Text>

              </View>
            )}
          />
        </View>
      </Modal>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.dropdownItemText}
        placeholder="Filter Category"
        maxHeight={220}
        data={categories}
        labelField="label"
        valueField="value"
        value={selectedCategory}
        onChange={item => setSelectedCategory(item.value)}
        renderLeftIcon={() => <Ionicons name="search" size={25} color="white" style={{ marginRight: 10 }} />}
        renderRightIcon={null}
      />

      <FlatList
        style={{ flex: 1 }}
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your fridge is empty. Click Add icon to restock</Text>
              <Image source={require('../assets/empty-fridge-image.png')} style={styles.emptyImage} resizeMode="contain" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found in this category</Text>
            </View>
          )
        }
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

  tileContainer: {
    width: '48%',
    marginHorizontal: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    paddingRight: 15,
    paddingLeft: 7,
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
  tile: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,

  },
  tileHeader: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    alignItems: 'center',
  },

  itemName: {
    fontSize: 16,
    fontFamily: 'NunitoBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 2,
  },

  foodImage: {
    width: 75,
    height: 75,
  },
  qtyBox: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingVertical: 4,
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  qtyText: {
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    color: '#292929',
  },

  expiryBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 4,
    marginLeft: 6,
  },

  cleanExpiryText: {
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: 'NunitoMedium',
    fontSize: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#292929',
  },

  statusDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 10,
    top: -5,
    right: -4,
    borderWidth: 1,
    borderColor: '#292929',
  },

  tileFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 175,
    marginTop: 10,

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

  imageBackgroundCircle: {
    width: 175,
    height: 175,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
    paddingTop: 25,
  },

  innerWhiteCircle: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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

  expiredInnerCircle: {
    backgroundColor: '#D9D9D9',
    opacity: 0.7,
  },

  expiredImage: {
    opacity: 0.35,
  },

  expiredText: {
    opacity: 0.45,
    textDecorationLine: 'line-through'
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