import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getDaysLeft, TILE_COLORS, EXPIRED_TILE_COLORS } from '../utils/fridgeHelpers';
import { fridgeTileStyles as styles } from '../Styles/fridgeTileStyles';

export default function FridgeTile({ item, index, navigation }) {
  const info = getDaysLeft(item.expiryDate);
  const itemHasExpired = info.days < 0;

  const backgroundColor = itemHasExpired
    ? EXPIRED_TILE_COLORS[index % EXPIRED_TILE_COLORS.length]
    : TILE_COLORS[index % TILE_COLORS.length];

  let bannerElement = null;
  if (info.days >= 0 && info.days <= 2) {
    bannerElement = (
      <View style={[styles.bannerOverlay, styles.bannerRed1]}>
        <Text style={styles.bannerText}>⏰ PLEASE HURRY!</Text>
      </View>
    );
  } else if (info.days >= 3 && info.days <= 4) {
    bannerElement = (
      <View style={[styles.bannerOverlay, styles.bannerOrange]}>
        <Text style={styles.bannerText}>⏳ SLOWLY DYING...</Text>
      </View>
    );
  }

  let statusColor = '#FFFFFF';
  if (info.days < 0) statusColor = 'grey';
  else if (info.days <= 2) statusColor = '#FF3800';
  else if (info.days <= 5) statusColor = '#FFC700';

  const imageSource = item.imageUrl && !item.imageUrl.includes('no.jpg') 
    ? { uri: item.imageUrl } 
    : require('../assets/modal-tile-image.png');

  return (
    <View style={[styles.tileContainer, itemHasExpired && styles.expiredTile]}>
      <View style={styles.tile}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}>
          <View style={[styles.imageBackgroundCircle, { backgroundColor }]}>
            <View style={[styles.innerWhiteCircle, itemHasExpired && styles.expiredInnerCircle]}>
              <Image source={imageSource} style={[styles.foodImage, itemHasExpired && styles.expiredImage]} resizeMode="contain" />
            </View>
            {bannerElement}
            <Text style={[styles.itemName, itemHasExpired && styles.expiredItemName]}>{item.name}</Text>
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
}

