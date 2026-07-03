import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { FridgeContext } from '../context/FridgeContext';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { activityLog = [] } = useContext(FridgeContext) || {};
  const [selectedFilter, setSelectedFilter] = useState('All statistics');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // --- 📊 Data Pipeline Syncing ---
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  
  activityLog.forEach(log => {
    const date = new Date(log.timestamp);
    const dayName = weekdayNames[date.getDay()];
    if (weeklyActivity[dayName] !== undefined) {
      weeklyActivity[dayName] += Number(log.qty) || 1;
    }
  });
  const weeklyPoints = Object.values(weeklyActivity);

  const categoryCounts = {};
  activityLog.forEach(log => {
    if (log.action === 'added') {
      const category = log.category || 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + (Number(log.qty) || 1);
    }
  });

  const foodCounts = {};
  activityLog.forEach(log => {
    if (log.action === 'added' && log.itemName) {
      foodCounts[log.itemName] = (foodCounts[log.itemName] || 0) + (Number(log.qty) || 1);
    }
  });
  const topFoods = Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // --- 📈 Chart Configurations ---
  const hasLineData = weeklyPoints.some(v => v > 0);
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: hasLineData ? weeklyPoints : [0, 0, 0, 0, 0, 0, 0],
      strokeWidth: 3
    }]
  };

  const categoriesPresent = Object.keys(categoryCounts);
  const totalItemsTracked = Object.values(categoryCounts).reduce((sum, v) => sum + v, 0);

  // ProgressChart requires an object structure matching this: { labels: [], data: [0.0 - 1.0] }
  const progressChartData = {
    labels: categoriesPresent.length > 0 ? categoriesPresent.slice(0, 3) : ['No Logs'],
    data: categoriesPresent.length > 0 
      ? categoriesPresent.slice(0, 3).map(cat => totalItemsTracked > 0 ? categoryCounts[cat] / totalItemsTracked : 0)
      : [0]
  };

  const colorPalette = ['#EC6039', '#E7B1A6', '#E7C665', '#B2DFE8', '#A8C3A4'];

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

        {/* Weekly Consumption Graph */}
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

        {/* Corrected Progress Chart Element */}
        <Text style={styles.sectionTitle}>Your food statistics breakdown</Text>
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

        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowDetailModal(true)}>
          <Text style={styles.seeMoreButtonText}>SEE MORE</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Details Sheet Overlay */}
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
              <Text style={styles.emptyText}>Add some items to your fridge to populate your charts! 🎉</Text>
            }
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={[styles.colorDot, { backgroundColor: colorPalette[index] || '#4F6BB7' }]} />
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

const progressChartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1, index) => {
    const scheme = ['#EC6039', '#E7B1A6', '#E7C665'];
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
  itemCountText: { fontSize: 17, fontWeight: '700', color: '#333' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 16, paddingHorizontal: 20 }
});