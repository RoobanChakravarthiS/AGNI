import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FinalPage = ({navigation,route}) => {
    const data = route.params
    console.log(data)
  return (
    <View>
      <Text>FinalPage</Text>
    </View>
  )
}

export default FinalPage

const styles = StyleSheet.create({})