import { View, Text } from 'react-native'
import React from 'react'

const bodyText = "Shopping placeholder screen"

export default function Shopping(){
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
    marginLeft: 60,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#EC6039',
  }
}


