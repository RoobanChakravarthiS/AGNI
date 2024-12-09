import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottiePage = ({navigation}) => {

  useEffect(()=>{
    setTimeout(()=>{
      navigation.navigate('BottomTab')
    },3000)
  })
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/final.json')} // Replace with your Lottie file
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 400, // Adjust size as per requirement
    height: 400, // Adjust size as per requirement
  },
});

export default LottiePage;
