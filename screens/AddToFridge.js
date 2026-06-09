import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useContext, useEffect, useRef } from 'react'; // 1. Added useRef here
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { FridgeContext } from '../context/FridgeContext';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';

const categories = [
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

export default function AddToFridge({ navigation }) {
  const { addItem } = useContext(FridgeContext);
  const webDatePickerRef = useRef(null); 
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [displayDateString, setDisplayDateString] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setExpiryDate(selectedDate);

      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const europeanStr = `${day}/${month}/${year}`;

      setDisplayDateString(europeanStr);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !qty.trim() || !category) {
      Alert.alert('Missing Info', 'Please select a category and fill in all fields before saving.', [{ text: 'OK' }]);
      return;
    }
    setIsSaving(true);

    let finalImageUrl = 'https://spoonacular.com/cdn/ingredients_250x250/apple.png';

    try {
      const cleanSearchQuery = name.trim().toLowerCase();
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(cleanSearchQuery)}&number=1&apiKey=${SPOONACULAR_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          const [targetIngredient] = data.results;
          const foundImageFilename = targetIngredient?.image || targetIngredient?.['image'];

          if (foundImageFilename) {
            const cleanFilename = String(foundImageFilename).replace(/["'\s]/g, '');
            finalImageUrl = `https://spoonacular.com/cdn/ingredients_250x250/${cleanFilename}`;
          }
        }
      }
    } catch (error) {
      console.log('❌ Core Spoonacular Engine Crash:', error);
    }

    const today = new Date();
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayYear = today.getFullYear();
    const europeanAddedAt = `${todayDay}/${todayMonth}/${todayYear}`;

    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      qty: Number(qty),
      category: category,
      imageUrl: finalImageUrl,
      addedAt: europeanAddedAt,
      expiryDate: displayDateString,
    };

    addItem(newItem);
    setName('');
    setQty('');
    setCategory(null);
    setExpiryDate(new Date());
    setDisplayDateString(`${todayDay}/${todayMonth}/${todayYear}`);
    setIsSaving(false);

    navigation.navigate('FridgeHome');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject}>
        <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={() => navigation.goBack()} />
      </BlurView>

      <View style={styles.modalCard}>
        <View style={styles.illustrationBadge}>
          <Image source={require('../assets/modal-tile-image.png')} style={styles.illustrationImage} resizeMode="contain" />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <View style={styles.circle}>
            <Text style={styles.closeButtonText}>✕</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.heading}>Add a product:</Text>
        <Text style={styles.subheading}>Type the name of your product</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          value={category}
          onChange={item => setCategory(item.value)}
        />

        <TextInput
          placeholder="Product Name..."
          placeholderTextColor="#000000"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Quantity..."
          placeholderTextColor="#000000"
          style={styles.input}
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
        />

        {Platform.OS === 'web' ? (
          <View style={{ width: '100%', position: 'relative' }}>
            <TouchableOpacity style={styles.input} onPress={() => {
                if (webDatePickerRef.current) {
                  webDatePickerRef.current.showPicker(); 
                }
              }}
            >
              <Text style={styles.dateText}> Expires: {displayDateString} </Text>
            </TouchableOpacity>

            <input
              ref={webDatePickerRef}
              type="date"
              value={`${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-${String(expiryDate.getDate()).padStart(2, '0')}`}
              onChange={(e) => {
                if (e.target.value) {
                  const [year, month, day] = e.target.value.split('-');
                  const selected = new Date(Number(year), Number(month) - 1, Number(day));
                  setExpiryDate(selected);
                  setDisplayDateString(`${day}/${month}/${year}`);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                pointerEvents: 'none'
              }}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}> Expires: {displayDateString} </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' && (
        <Modal visible={showDatePicker} transparent={true} animationType="slide">
          <View style={styles.iosModalContainer}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
            <View style={styles.iosModalContent}>
              <DateTimePicker value={expiryDate} mode="date" display="inline" onChange={onDateChange} />
              <TouchableOpacity style={styles.iosDoneButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.iosDoneButtonText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker value={expiryDate} mode="date" display="default" onChange={onDateChange} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderWidth: 4,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  illustrationBadge: {
    width: 105,
    height: 105,
    position: 'absolute',
    marginTop: -30,
    marginLeft: 3,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderWidth: 1,
    borderRadius: 52.5,
    backgroundColor: 'rgba(236, 96, 57, 1)',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',

  },
  illustrationImage: {
    width: 135,
    height: 135,
    marginRight: 14,

  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,

  },

  circle: {
    width: 25,
    height: 25,
    borderRadius: 52.5,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 24,
    fontFamily: 'NunitoBold',
    color: '#333',
    marginLeft: 80,
    marginTop: 20,
  },
  subheading: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
    marginBottom: 20,
    marginLeft: 80,

  },
  input: {
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    marginVertical: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(236, 96, 57, 1)',
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },
  dropdownSelectedText: {
    fontSize: 15,
    fontFamily: 'NunitoMedium',
    color: '#000000',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoBold',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'NunitoMedium',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 4,
    borderColor: "rgba(236, 96, 57, 1)",
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 24,
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'rgba(236, 96, 57, 1)',
    fontFamily: 'NunitoBold',
    fontSize: 15,
    textTransform: 'uppercase',
  }


});