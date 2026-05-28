import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const bodyText = "Profile placeholder screen"


const handleNuclearReset = async () => {
  try {
    await AsyncStorage.clear(); // Force deletes all stored app files on the device disk
    alert("Storage entirely wiped! Restart your app server now.");
  } catch (e) {
    console.log("Failed to clear storage:", e);
  }
};

export default function Profile(){
  return (
    <View>
      <Text style = {styles.bodyText}>
       <Text>{bodyText}</Text>
       </Text>

               <TouchableOpacity style={styles.nuclearButton} onPress={handleNuclearReset}>
         <Text style={styles.nuclearButtonText}>⚠️ WIPE ALL STORAGE</Text>
       </TouchableOpacity>
    </View>
  )
}

const styles = {
bodyText:{
  top: 300, 
  marginLeft: 90,
  fontWeight: 'bold',
  fontSize: 20,
  color: '#EC6039',
},

nuclearButton:{
    top: 500, 
    borderColor: 'red',
    borderWidth: 1,
    marginLeft: '20%',
    marginRight: '20%',
    padding: 10,

}

}



