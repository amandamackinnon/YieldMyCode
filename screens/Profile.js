import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; 
import { PieChart as GiftedPieChart } from 'react-native-gifted-charts'; 
import { FridgeContext } from '../context/FridgeContext';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { activityLog = [] } = useContext(FridgeContext) || {};
  const [selectedFilter, setSelectedFilter] = useState('All statistics');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const wastedCategoryCounts = {};
  const eatenCategoryCounts = {};

  activityLog.forEach(log => {
    const action = log.action ? log.action.toLowerCase() : '';
    const category = log.category || 'Other';
    const qty = Number(log.qty) || 1;

    if (action === 'consumed') {
      const date = new Date(log.timestamp);
      const dayName = weekdayNames[date.getDay()];
      if (weeklyActivity[dayName] !== undefined) {
        weeklyActivity[dayName] += qty;
      }
      // Eaten categories breakdown
      eatenCategoryCounts[category] = (eatenCategoryCounts[category] || 0) + qty;
    } 
    else if (action === 'wasted' || action === 'removed') {
      // Wasted categories breakdown
      wastedCategoryCounts[category] = (wastedCategoryCounts[category] || 0) + qty;
    }
  });

  // Assemble Line Chart Data
  const weeklyPoints = Object.values(weeklyActivity);
  const hasLineData = weeklyPoints.some(v => v > 0);
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: hasLineData ? weeklyPoints : [0, 0, 0, 0, 0, 0, 0],
      strokeWidth: 3
    }]
  };

  // Helper function to map category tallies to Gifted Charts data format
  const generateDonutData = (countsMap, colorsPalette) => {
    const totalItems = Object.values(countsMap).reduce((sum, v) => sum + v, 0);
    if (totalItems === 0) return null;

    return Object.keys(countsMap).map((category, index) => {
      const value = countsMap[category];
      const percentage = Math.round((value / totalItems) * 100);
      return {
        value,
        color: colorsPalette[index % colorsPalette.length],
        label: category.charAt(0).toUpperCase() + category.slice(1),
        text: `${percentage}%`,
        textColor: '#222222',
        fontWeight: 'bold',
        fontSize: 12
      };
    });
  };

  // Palettes (Warm tones for waste, Fresh/Cool tones for consumption)
  const wasteColors = ['#EC6039', '#E7C665', '#E7B1A6', '#B2DFE8', '#A8C3A4'];
  const eatenColors = ['#4A9B6B', '#5FA8D3', '#9BC53D', '#2A6F97', '#A3C1AD'];

  const wastedDonutData = generateDonutData(wastedCategoryCounts, wasteColors);
  const eatenDonutData = generateDonutData(eatenCategoryCounts, eatenColors);

  // Fallbacks for empty states
  const emptyWastedFallback = [{ value: 1, color: '#EAEAEA', label: 'No Waste', text: '0%' }];
  const emptyEatenFallback = [{ value: 1, color: '#EAEAEA', label: 'No Data Yet', text: '0%' }];

  // --- 📊 4. MOST ADDED LEADERBOARD PIPELINE ---
  const foodCounts = {};
  activityLog.forEach(log => {
    if (log.itemName) {
      foodCounts[log.itemName] = (foodCounts[log.itemName] || 0) + (Number(log.qty) || 1);
    }
  });
  const topFoods = Object.entries(foodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Navigation Tabs */}
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

        {/* 📈 Chart 1: Over-time Tracking */}
        <Text style={styles.sectionTitle}>Your weekly food consumption</Text>
        <View style={styles.lineChartWrapper}>
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
        </View>

        {/* 🥗 Chart 2: Food Eaten Breakdown */}
        <Text style={styles.sectionTitle}>Food saved</Text>
        <View style={styles.donutCardContainer}>
          <GiftedPieChart
            donut
            data={eatenDonutData || emptyEatenFallback}
            radius={85}
            innerRadius={55}
            showText={!!eatenDonutData}
            labelsPosition="outward"
            strokeWidth={3}
            strokeColor="#ffffff"
          />
          <View style={styles.legendContainer}>
            {(eatenDonutData || emptyEatenFallback).map((item, idx) => (
              <View key={idx} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>
                  {item.value === 1 && !eatenDonutData ? "" : `${item.value} `}{item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 🍩 Chart 3: Food Wasted Breakdown */}
        <Text style={styles.sectionTitle}>Your food waste</Text>
        <View style={styles.donutCardContainer}>
          <GiftedPieChart
            donut
            data={wastedDonutData || emptyWastedFallback}
            radius={85}
            innerRadius={55}
            showText={!!wastedDonutData}
            labelsPosition="outward"
            strokeWidth={3}
            strokeColor="#ffffff"
          />
          <View style={styles.legendContainer}>
            {(wastedDonutData || emptyWastedFallback).map((item, idx) => (
              <View key={idx} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>
                  {item.value === 1 && !wastedDonutData ? "" : `${item.value} `}{item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Detail Toggle Button */}
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowDetailModal(true)}>
          <Text style={styles.seeMoreButtonText}>SEE MORE</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Leaderboard Detail Overlay Panel */}
      <Modal visible={showDetailModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <Ionicons name="close-circle" size={36} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalTitle}>Most Added Foods</Text>
          
          <FlatList
            data={topFoods}
            keyExtractor={(item) => item[0]}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Add some items to populate your metrics! 🎉</Text>
            }
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={[styles.colorDot, { backgroundColor: wasteColors[index] || '#4F6BB7' }]} />
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


const lineChartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(236, 96, 57, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '4.5', strokeWidth: '2', stroke: '#EC6039' }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 20 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  filterButton: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#4F6BB7', alignItems: 'center', backgroundColor: '#FFF' },
  activeFilterButton: { backgroundColor: '#4F6BB7' },
  filterText: { fontSize: 13, color: '#4F6BB7', fontWeight: '600' },
  activeFilterText: { color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 28, marginBottom: 14 },
  lineChartWrapper: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },
  donutCardContainer: { backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F2F2F2', marginBottom: 8 },
  legendContainer: { flexDirection: 'column', width: '80%', marginTop: 20, paddingHorizontal: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  legendLabel: { fontSize: 15, color: '#444', fontWeight: '500' },
  seeMoreButton: { backgroundColor: '#EC6039', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  seeMoreButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
  modalContainer: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 24 },
  modalHeader: { width: '100%', alignItems: 'flex-end', marginBottom: 10 },
  modalTitle: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 24, textAlign: 'center' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  listItemLeft: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 14 },
  itemNameText: { fontSize: 17, color: '#333', textTransform: 'capitalize' },
  itemCountText: { fontSize: 17, fontWeight: '700', color: '#333' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 16 }
});