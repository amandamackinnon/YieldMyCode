import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const bodyText = "Profile placeholder screen"



export default function Profile(){
  return (
    <View>
      <Text style = {styles.bodyText}>
       <Text>{bodyText}</Text>
       </Text>

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


}



