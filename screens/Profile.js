import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; 
import { PieChart as GiftedPieChart } from 'react-native-gifted-charts'; 
import { FridgeContext } from '../context/FridgeContext';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { activityLog = [] } = useContext(FridgeContext) || {};
  const [showDetailModal, setShowDetailModal] = useState(false);

  // =========================================================
  // 📈 PIPELINE 1: TIME FILTER FOR CURRENT CALENDAR WEEK ONLY
  // =========================================================
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    // Anchor onto most recent Monday morning at 00:00:00
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // Up to midnight Sunday

  const weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const weekdayNamesMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // =========================================================
  // 🍩 PIPELINE 2: DONUT FREQUENCY COUNTERS (NOT QUANTITIES)
  // =========================================================
  const wastedCategoryCounts = {};
  const eatenCategoryCounts = {};
  let totalSavedItemsCount = 0;
  let totalWastedItemsCount = 0;

  activityLog.forEach(log => {
    if (!log.timestamp) return;

    const logDate = new Date(log.timestamp);
    const action = log.action ? log.action.toLowerCase() : '';
    const category = log.category || 'Other';

    // A) Populate Line Chart Data (STRICT CURRENT WEEK CHECK)
    if (logDate >= startOfWeek && logDate < endOfWeek) {
      if (action === 'consumed' || action === 'wasted') {
        const lineDayName = weekdayNamesMap[logDate.getDay()];
        // Each log item counts as 1 individual activity event
        weeklyActivity[lineDayName] = (weeklyActivity[lineDayName] || 0) + 1;
      }
    }

    // B) Populate Donut Chart Tallies (Frequency of item entries)
    if (action === 'consumed') {
      eatenCategoryCounts[category] = (eatenCategoryCounts[category] || 0) + 1;
      totalSavedItemsCount++;
    } else if (action === 'wasted' || action === 'removed') {
      wastedCategoryCounts[category] = (wastedCategoryCounts[category] || 0) + 1;
      totalWastedItemsCount++;
    }
  });

  // Assemble Line Chart Data Structure
  const weeklyPoints = Object.values(weeklyActivity);
  const hasLineData = weeklyPoints.some(v => v > 0);
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: hasLineData ? weeklyPoints : [0, 0, 0, 0, 0, 0, 0],
      strokeWidth: 3
    }]
  };

  // =========================================================
  // 🛠️ PIPELINE 3: COMPONENT DATA GENERATOR (WITH % LABELS)
  // =========================================================
  const generateDonutData = (countsMap, totalItems, colorsPalette) => {
    if (totalItems === 0) return null;

    return Object.keys(countsMap).map((category, index) => {
      const occurrenceCount = countsMap[category];
      const percentage = Math.round((occurrenceCount / totalItems) * 100);
      return {
        value: occurrenceCount, // Keeps donut slice sizes physically proportional
        color: colorsPalette[index % colorsPalette.length],
        label: category.charAt(0).toUpperCase() + category.slice(1),
        percentageText: `${percentage}%`, // Displayed inside the legend list below
        text: `${percentage}%`,
        textColor: '#222222',
        fontWeight: 'bold',
        fontSize: 12
      };
    });
  };

  const wasteColors = ['#EC6039', '#E7C665', '#E7B1A6', '#B2DFE8', '#A8C3A4'];
  const eatenColors = ['#4A9B6B', '#5FA8D3', '#9BC53D', '#2A6F97', '#A3C1AD'];

  const eatenDonutData = generateDonutData(eatenCategoryCounts, totalSavedItemsCount, eatenColors);
  const wastedDonutData = generateDonutData(wastedCategoryCounts, totalWastedItemsCount, wasteColors);

  const emptyWastedFallback = [{ value: 1, color: '#EAEAEA', label: 'No Waste', percentageText: '0%' }];
  const emptyEatenFallback = [{ value: 1, color: '#EAEAEA', label: 'No Data Yet', percentageText: '0%' }];

  // =========================================================
  // 🗑️ PIPELINE 4: ITEMIZED DETAIL MODAL (KEEPS ORIGINAL UNITS)
  // =========================================================
  const wastedItemsMap = {};
  activityLog.forEach(log => {
    const action = log.action ? log.action.toLowerCase() : '';
    if (action === 'wasted' || action === 'removed') {
      if (log.itemName) {
        const name = log.itemName.trim();
        const qty = Number(log.qty) || 1;
        const unit = log.unit && log.unit.trim() !== '' ? log.unit : 'pcs';
        const key = `${name}_${unit}`;

        if (wastedItemsMap[key]) {
          wastedItemsMap[key].qty += qty;
        } else {
          wastedItemsMap[key] = { name, qty, unit };
        }
      }
    }
  });
  const itemizedWasteList = Object.values(wastedItemsMap).sort((a, b) => b.qty - a.qty);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

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

        {/* 📊 SIDE-BY-SIDE DONUT GRAPHS WRAPPER */}
        <View style={styles.chartsRow}>
          
          {/* 🥗 Left Column: Food Eaten */}
          <View style={styles.halfColumn}>
            <Text style={styles.smallSectionTitle}>Food saved</Text>
            <View style={styles.donutCardContainer}>
              <GiftedPieChart
                donut
                data={eatenDonutData || emptyEatenFallback}
                radius={45}       
                innerRadius={30}  
                showText={false}   
                strokeWidth={2}
                strokeColor="#ffffff"
              />
              <View style={styles.legendContainer}>
                {(eatenDonutData || emptyEatenFallback).map((item, idx) => (
                  <View key={idx} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>
                      {/* ✅ Now displays clean percentage values instead of large mass units */}
                      {item.percentageText} {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 🍩 Right Column: Food Wasted */}
          <View style={styles.halfColumn}>
            <Text style={styles.smallSectionTitle}>Your food waste</Text>
            <View style={styles.donutCardContainer}>
              <GiftedPieChart
                donut
                data={wastedDonutData || emptyWastedFallback}
                radius={45}       
                innerRadius={30}
                showText={false}
                strokeWidth={0}
                strokeColor="#ffffff"
              />
              <View style={styles.legendContainer}>
                {(wastedDonutData || emptyWastedFallback).map((item, idx) => (
                  <View key={idx} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>
                      {/* ✅ Now displays clean percentage values instead of large mass units */}
                      {item.percentageText} {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

        </View>

        {/* Info Detail Toggle Button */}
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowDetailModal(true)}>
          <Text style={styles.seeMoreButtonText}>SEE MORE</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🗑️ Wasted Food Itemized Detail Overlay Panel */}
      <Modal visible={showDetailModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
              <Ionicons name="close-circle" size={36} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalTitle}>Wasted Food Breakdown</Text>
          
          <FlatList
            data={itemizedWasteList}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Great job! No food has been wasted yet! 🎉</Text>
            }
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={[styles.colorDot, { backgroundColor: wasteColors[index % wasteColors.length] }]} />
                  <Text style={styles.itemNameText}>{item.name}</Text>
                </View>
                {/* Keep original details inside modal view (e.g. 250 g) */}
                <Text style={styles.itemCountText}>
                  {item.qty} <Text style={styles.unitText}>{item.unit}</Text>
                </Text>
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
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  filterButton: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#4F6BB7', alignItems: 'center', backgroundColor: '#FFF' },
  activeFilterButton: { backgroundColor: '#4F6BB7' },
  filterText: { fontSize: 13, color: '#4F6BB7', fontWeight: '600' },
  activeFilterText: { color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 28, marginBottom: 14 },
  lineChartWrapper: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },
  donutCardContainer: { backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: '#F2F2F2', marginBottom: 8 },
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
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 16 },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  halfColumn: {
    width: '48%', // Leaves a tiny 4% gap right down the middle
  },
  smallSectionTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#222', 
    marginBottom: 8,
    textAlign: 'center' 
  },
  donutCardContainer: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    paddingVertical: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 0, 
    borderColor: '#F2F2F2',
    minHeight: 200 // Ensures both containers stay perfectly uniform in height
  },
  legendContainer: { 
    flexDirection: 'column', 
    width: '90%', 
    marginTop: 12, 
    paddingHorizontal: 4 
  },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 4 
  },
  legendDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 6 
  },
  legendLabel: { 
    fontSize: 12, 
    color: '#444', 
    fontWeight: '500',
    flex: 1 // Prevents long text names from breaking onto new lines unexpectedly
  },
unitText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    textTransform: 'lowercase', // Keeps units like 'G' or 'PCS' uniformly neat
  },

});