import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { FridgeContext } from '../context/FridgeContext';
import { getTotalItemsAdded, getWeeklyActivity, getItemsByCategory, getTopFoods } from '../services/analyticsService';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { activityLog = [] } = useContext(FridgeContext) || {};
  const [selectedFilter, setSelectedFilter] = useState('All statistics');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 📈 Parse dynamic data through your custom service functions
  const weeklyActivity = getWeeklyActivity(activityLog);
  const weeklyPoints = Object.values(weeklyActivity);
  
  const categoryData = getItemsByCategory(activityLog);
  const topFoods = getTopFoods(activityLog); // Returns sorted array format: [[itemName, count]]

  // --- 1. Line Chart Data Preparation ---
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      // Fallback points match designer's placeholder if user hasn't added logs yet
      data: weeklyPoints.every(val => val === 0) ? [10, 35, 12, 55, 20, 25, 18] : weeklyPoints,
      strokeWidth: 3
    }]
  };

  // --- 2. Chart Layouts & Mappings for Breakdown Wheel ---
  const colorPalette = {
    'Core fruits': '#EC6039',
    'Berries': '#E7B1A6',
    'Citrus': '#E7C665',
    'Tropical': '#B2DFE8',
    'Other': '#A8C3A4'
  };

  const categoriesPresent = Object.keys(categoryData);
  const totalItemsTracked = Object.values(categoryData).reduce((sum, v) => sum + v, 0);

  // ProgressChart needs a normalized fractional float list [0.0 - 1.0]
  const progressChartData = {
    labels: categoriesPresent.length > 0 ? categoriesPresent.slice(0, 4) : ['Core fruits', 'Berries', 'Citrus', 'Tropical'],
    data: categoriesPresent.length > 0 
      ? categoriesPresent.slice(0, 4).map(cat => totalItemsTracked > 0 ? categoryData[cat] / totalItemsTracked : 0)
      : [0.37, 0.26, 0.23, 0.14] // Fallback values matching layout mockup
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Filter Category Header Pills */}
        <View style={styles.filterContainer}>
          {['Veggies', 'Fruits', 'All statistics'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterButton, selectedFilter === tab && styles.activeFilterButton]}
              onPress={() => setSelectedFilter(tab)}
            >
              <Text style={[styles.filterText, selectedFilter === tab && styles.activeFilterText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Consumption Line Graph */}
        <Text style={styles.sectionTitle}>Your weekly food consumption</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={lineChartConfig}
          bezier
          style={styles.chartStyle}
          withInnerLines={false}
          withOuterLines={false}
        />

        {/* Waste Breakdown Section */}
        <Text style={styles.sectionTitle}>Your food waste</Text>
        <View style={styles.chartWrapper}>
          <ProgressChart
            data={progressChartData}
            width={screenWidth - 32}
            height={190}
            strokeWidth={10}
            radius={32}
            chartConfig={progressChartConfig}
            hideLegend={false}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowDetailModal(true)}>
          <Text style={styles.seeMoreButtonText}>SEE MORE</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Breakdown sheet */}
      <Modal visible={showDetailModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <Ionicons name="close-circle" size={36} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalTitle}>What you wasted?</Text>
          
          <FlatList
            data={topFoods.length > 0 ? topFoods : [['Avocado', 3], ['Oranges', 9], ['Lemons', 3], ['Tomatoes', 2], ['Apple', 8]]}
            keyExtractor={(item) => item[0]}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={[styles.colorDot, { backgroundColor: Object.values(colorPalette)[index] || '#4F6BB7' }]} />
                  <Text style={styles.itemNameText}>{item[0]}</Text>
                </View>
                <Text style={styles.itemCountText}>{item[1]}</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

// Chart Aesthetics Setup
const lineChartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(236, 96, 57, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '4.5', strokeWidth: '2', stroke: '#EC6039' }
};

const progressChartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1, index) => {
    const scheme = ['#EC6039', '#E7B1A6', '#E7C665', '#B2DFE8'];
    return scheme[index] || `rgba(79, 107, 183, ${opacity})`;
  },
  labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 20 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  filterButton: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#4F6BB7', alignItems: 'center', backgroundColor: '#FFF' },
  activeFilterButton: { backgroundColor: '#4F6BB7' },
  filterText: { fontSize: 13, color: '#4F6BB7', fontWeight: '600' },
  activeFilterText: { color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 24, marginBottom: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },
  chartWrapper: { backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  seeMoreButton: { backgroundColor: '#EC6039', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  seeMoreButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
  modalContainer: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 24 },
  modalHeader: { width: '100%', alignItems: 'flex-end', marginBottom: 10 },
  modalTitle: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 24, textAlign: 'center' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  listItemLeft: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 14 },
  itemNameText: { fontSize: 17, color: '#333', textTransform: 'capitalize' },
  itemCountText: { fontSize: 17, fontWeight: '700', color: '#333' }
});