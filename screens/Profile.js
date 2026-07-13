import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { PieChart as GiftedPieChart } from 'react-native-gifted-charts';
import { FridgeContext } from '../context/FridgeContext';
import { profileStyle as styles } from '../Styles/profileStyle';

const screenWidth = Dimensions.get('window').width;

export default function Profile() {
  const { activityLog = [] } = useContext(FridgeContext) || {};
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const weekdayNamesMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const wastedCategoryCounts = {};
  const eatenCategoryCounts = {};
  let totalSavedItemsCount = 0;
  let totalWastedItemsCount = 0;

  activityLog.forEach(log => {
    if (!log.timestamp) return;

    const logDate = new Date(log.timestamp);
    const action = log.action ? log.action.toLowerCase() : '';
    const category = log.category || 'Other';

    if (logDate >= startOfWeek && logDate < endOfWeek) {
      if (action === 'consumed' || action === 'wasted') {
        const lineDayName = weekdayNamesMap[logDate.getDay()];

        weeklyActivity[lineDayName] = (weeklyActivity[lineDayName] || 0) + 1;
      }
    }

    if (action === 'consumed') {
      eatenCategoryCounts[category] = (eatenCategoryCounts[category] || 0) + 1;
      totalSavedItemsCount++;
    } else if (action === 'wasted' || action === 'removed') {
      wastedCategoryCounts[category] = (wastedCategoryCounts[category] || 0) + 1;
      totalWastedItemsCount++;
    }
  });

  const weeklyPoints = Object.values(weeklyActivity);
  const hasLineData = weeklyPoints.some(v => v > 0);
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: hasLineData ? weeklyPoints : [0, 0, 0, 0, 0, 0, 0],
      strokeWidth: 3
    }]
  };

  const generateDonutData = (countsMap, totalItems, colorsPalette) => {
    if (totalItems === 0) return null;

    return Object.keys(countsMap).map((category, index) => {
      const occurrenceCount = countsMap[category];
      const percentage = Math.round((occurrenceCount / totalItems) * 100);
      return {
        value: occurrenceCount,
        color: colorsPalette[index % colorsPalette.length],
        label: category.charAt(0).toUpperCase() + category.slice(1),
        percentageText: `${percentage}%`,
        text: `${percentage}%`,
        textColor: '#222222',
        fontWeight: 'bold',
        fontSize: 12,

      };
    });
  };

  const wasteColors = ['#F3B0A5', '#87B9C2', '#EC6039', '#FFB500', '#A8C3A4', '#4F6BB7', '#E7C665', '#699966'];
  const eatenColors = ['#B39DBC', '#4EA8DE', '#90E0EF', '#DDA15E', '#98B4A6', '#5E60CE', '#D8C3A5', '#0077B6'];

  const eatenDonutData = generateDonutData(eatenCategoryCounts, totalSavedItemsCount, eatenColors);
  const wastedDonutData = generateDonutData(wastedCategoryCounts, totalWastedItemsCount, wasteColors);

  const emptyWastedFallback = [{ value: 1, color: '#EAEAEA', label: 'No Waste', percentageText: '0%' }];
  const emptyEatenFallback = [{ value: 1, color: '#EAEAEA', label: 'No Data Yet', percentageText: '0%' }];

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

        <View style={styles.chartsRow}>

          <View style={styles.halfColumn}>
            <Text style={styles.smallSectionTitle}>Food saved</Text>
            <View style={styles.donutCardContainer}>
              <GiftedPieChart
                donut
                data={eatenDonutData || emptyEatenFallback}
                radius={45}
                innerRadius={25}
                showText={false}
                strokeWidth={3}
                strokeColor="#ffffff"
              />
              <View style={styles.legendContainer}>
                {(eatenDonutData || emptyEatenFallback).map((item, idx) => (
                  <View key={idx} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>
                      {item.percentageText} {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.halfColumn}>
            <Text style={styles.smallSectionTitle}>Your food waste</Text>
            <View style={styles.donutCardContainer}>
              <GiftedPieChart
                donut
                data={wastedDonutData || emptyWastedFallback}
                radius={45}
                innerRadius={25}
                showText={false}
                strokeWidth={3}
                strokeColor="#ffffff"
              />
              <View style={styles.legendContainer}>
                {(wastedDonutData || emptyWastedFallback).map((item, idx) => (
                  <View key={idx} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>
                      {item.percentageText} {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowDetailModal(true)}>
          <Text style={styles.seeMoreButtonText}>SEE MORE</Text>
        </TouchableOpacity>

      </ScrollView>

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
            showsVerticalScrollIndicator={true}
            style={{ width: '100%', marginHorizontal: -5 }}
                          // 🌟 THE ADJUSTMENT: Push the inner row content back in by the exact same amount
            contentContainerStyle={{
              paddingHorizontal: 20, 
              paddingBottom: 30,
            }}

            ListEmptyComponent={
              <Text style={styles.emptyText}>Great job! No food has been wasted yet! 🎉</Text>
            }
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={[styles.colorDot, { backgroundColor: wasteColors[index % wasteColors.length] }]} />
                  <Text style={styles.itemNameText}>{item.name}</Text>
                </View>
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

