import { View, StyleSheet } from 'react-native';

export default function ShoppingIcon({ color, size }) {
  const lineWidth = size * 0.57;
  const lineHeight = size * 0.054;

  return (
    <View style={[styles.square, { backgroundColor: color, width: size, height: size, borderRadius: size * 0.21 }]}>
      <View style={styles.lines}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.line,
              {
                width: i === 3 ? lineWidth * 0.67 : lineWidth,
                height: lineHeight,
                borderRadius: lineHeight / 2,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lines: {
    gap: 6,
  },
  line: {
    backgroundColor: 'white',
  },
});