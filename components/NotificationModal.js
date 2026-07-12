import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { fridgeStyles as styles } from '../Styles/fridgeStyles'; 

export default function NotificationModal({ 
  visible, 
  onClose, 
  notifications, 
  onToggleRead, 
  onMarkAllOrUndo, 
  onFactPress, 
  onRecipePress 
}) {
  const flatListRef = useRef(null);
  const allRead = notifications && notifications.length > 0 && notifications.every(n => n.isRead);

  useEffect(() => {
    if (visible) {
      setTimeout(() => flatListRef.current?.flashScrollIndicators(), 150);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
        )}
      </TouchableOpacity>

      <View style={styles.notificationDropdown}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>Notifications</Text>
          <TouchableOpacity onPress={onMarkAllOrUndo}>
            <Text style={styles.markAsRead}>
              {allRead ? "Undo Mark All" : "Mark all as read"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={notifications || []}
          keyExtractor={item => item.id}
          persistentScrollbar
          showsVerticalScrollIndicator
          renderItem={({ item }) => (
            <View style={styles.notificationContainerCell}>
              <View style={styles.notificationItem}>
                <TouchableOpacity onPress={() => onToggleRead(item.id)}>
                  <View style={[styles.indicatorDot, { backgroundColor: item.isRead ? '#FFFFFF' : '#E07A5F', borderColor: '#E07A5F' }]} />
                </TouchableOpacity>
                
                <TouchableOpacity style={{ flex: 1 }} onPress={() => onToggleRead(item.id)}>
                  <Text style={[styles.notificationText, { color: item.isRead ? '#999999' : '#2D3142', fontFamily: item.isRead ? 'NunitoRegular' : 'NunitoMedium' }]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              </View>

              {item.ingredientName && !item.isRead && (
                <View style={styles.actionLinksContainer}>
                  <TouchableOpacity 
                    onPress={() => onFactPress(item.ingredientName)} 
                    style={styles.linkTouchTarget}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                  >
                    <Text style={styles.actionLinkText}>Would you like some food trivia?</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => onRecipePress(item.ingredientName)} 
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
  );
}