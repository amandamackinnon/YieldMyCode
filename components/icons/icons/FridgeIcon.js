import { View, StyleSheet } from 'react-native';

export default function FridgeIcon({ color, size }) {
  const doorWidth = size * 0.32;
  const doorHeight = size * 0.64;
  const gap = size * 0.07;

  return (
    <View style={[styles.square, { backgroundColor: color, width: size, height: size, borderRadius: size * 0.21 }]}>
      <View style={styles.fridge}>
        <View style={[styles.door, { width: doorWidth, height: doorHeight }]} />
        <View style={{ width: gap }} />
        <View style={[styles.door, { width: doorWidth, height: doorHeight }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fridge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  door: {
    backgroundColor: 'white',
    borderRadius: 3,
    opacity: 0.9,
  },
});