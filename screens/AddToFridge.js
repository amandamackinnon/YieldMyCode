import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { FridgeContext } from '../context/FridgeContext';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import { categories, unitData, formatEuropeanDate } from '../utils/fridgeHelpers';
import { addToFridgeStyles as styles } from '../Styles/addToFridgeStyles';

const SPOONACULAR_API_KEY = Constants.expoConfig?.extra?.spoonacularApiKey || Constants.manifest?.extra?.spoonacularApiKey;

export default function AddToFridge({ navigation }) {
  const { addItem } = useContext(FridgeContext);
  const webDatePickerRef = useRef(null);
  
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [displayDateString, setDisplayDateString] = useState(() => formatEuropeanDate(new Date()));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    NunitoRegular: Nunito_400Regular,
    NunitoMedium: Nunito_500Medium,
    NunitoSemiBold: Nunito_600SemiBold,
    NunitoBold: Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
      setDisplayDateString(formatEuropeanDate(selectedDate));
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !qty.trim() || !category) {
      Alert.alert('Missing Info', 'Please fill in all fields before saving.');
      return;
    }
    setIsSaving(true);
    let finalImageUrl = null;

    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(name.trim().toLowerCase())}&number=1&apiKey=${SPOONACULAR_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        const foundImageFilename = data?.results?.[0]?.image;
        if (foundImageFilename && foundImageFilename !== 'no.jpg' && String(foundImageFilename).trim() !== '') {
          finalImageUrl = `https://spoonacular.com/cdn/ingredients_250x250/${String(foundImageFilename).replace(/["'\s]/g, '')}`;
        }
      }
    } catch (error) {
      console.log('❌ Spoonacular Search Failed:', error);
    }

    try {
      addItem({
        id: Date.now().toString(),
        name: name.trim(),
        qty: Number(qty),
        unit: unit?.trim() ? unit : 'pcs',
        category,
        imageUrl: finalImageUrl,
        addedAt: formatEuropeanDate(new Date()),
        expiryDate: displayDateString,
      });

      setName('');
      setQty('');
      setUnit('pcs');
      setCategory(null);
      setExpiryDate(new Date());
      setDisplayDateString(formatEuropeanDate(new Date()));

      setTimeout(() => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate('Fridge');
      }, Platform.OS === 'android' ? 300 : 0);
    } catch (err) {
      Alert.alert('Save Failed', 'Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject}>
        <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={() => navigation.goBack()} />
      </BlurView>

      <View style={styles.modalCard}>
        <View style={styles.illustrationBadge}>
          <Image source={require('../assets/modal-tile-image.png')} style={styles.illustrationImage} resizeMode="contain" />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <View style={styles.circle}><Text style={styles.closeButtonText}>✕</Text></View>
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

        <TextInput placeholder="Product Name..." placeholderTextColor="#000000" style={styles.input} value={name} onChangeText={setName} />

        <View style={styles.formRow}>
          <TextInput placeholder="Quantity..." placeholderTextColor="#000000" style={styles.halfInput} keyboardType="numeric" value={qty} onChangeText={setQty} />
          <Dropdown
            style={styles.halfDropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            maxHeight={155}
            containerStyle={[styles.dropdownOverlayMenu]}
            data={unitData}
            labelField="label"
            valueField="value"
            placeholder="UNIT"
            value={unit}
            onChange={item => setUnit(item.value)}
            flatListProps={{
              showsVerticalScrollIndicator: true,
              persistentScrollbar: Platform.OS === 'android',
              indicatorStyle: 'black',
            }} 
          />
        </View>

        {Platform.OS === 'web' ? (
          <View style={{ width: '100%', position: 'relative' }}>
            <TouchableOpacity style={styles.input} onPress={() => webDatePickerRef.current?.showPicker()}>
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
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }} 
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
        <Modal visible={showDatePicker} transparent animationType="slide">
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