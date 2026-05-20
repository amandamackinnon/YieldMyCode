import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddIcon({ color, size }) {
  return (
    <View style={[styles.circle, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="add" size={size * 0.57} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});