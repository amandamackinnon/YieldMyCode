import { View, Text, StyleSheet } from 'react-native';
import ProfileIcon from './icons/ProfileIcon';
import FridgeIcon from './icons/FridgeIcon';
import ShoppingIcon from './icons/ShoppingIcon';
import AddIcon from './icons/AddIcon';

const iconMap = {
  profile: ProfileIcon,
  fridge: FridgeIcon,
  shopping: ShoppingIcon,
  add: AddIcon,
};

export default function TabBarIcon({ name, label, focused }) {
  const IconComponent = iconMap[name];
  const activeColor = '#EC6039';
  const inactiveColor = '#F6CA5E';
  const color = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.container}>
      <IconComponent color={color} size={28} />
      <Text style={[styles.label, { color }]} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,        
    paddingTop: 15,
  },
  label: {
    fontSize: 12,     
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
    width: '100%',    
    fontFamily: 'NunitoBold',
  },
});